import { inject, injectable } from 'inversify';
import { IRegionCommand } from '../veau-command/interfaces/IRegionCommand';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { DataSourceError } from '../veau-general/DataSourceError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ISO3166 } from '../veau-vo/ISO3166';
import { Region } from '../veau-vo/Region';
import { Regions } from '../veau-vo/Regions';
import { IRegionQuery } from './interfaces/IRegionQuery';

@injectable()
export class RegionQuery implements IRegionQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Complex' = 'Complex';
  private readonly regionMySQLQuery: IRegionQuery;
  private readonly regionRedisQuery: IRegionQuery;
  private readonly regionCommand: IRegionCommand;

  public constructor(@inject(TYPE.RegionMySQLQuery) regionMySQLQuery: IRegionQuery,
    @inject(TYPE.RegionRedisQuery) regionRedisQuery: IRegionQuery,
    @inject(TYPE.RegionRedisCommand) regionCommand: IRegionCommand
  ) {
    this.regionMySQLQuery = regionMySQLQuery;
    this.regionRedisQuery = regionRedisQuery;
    this.regionCommand = regionCommand;
  }

  // TODO handling DataSourceError
  public async all(): Promise<Try<Regions, NoSuchElementError | DataSourceError>> {
    const trial1: Try<Regions, NoSuchElementError | DataSourceError> = await this.regionRedisQuery.all();

    return trial1.match<Promise<Try<Regions, NoSuchElementError | DataSourceError>>>((regions: Regions) => {
      return Promise.resolve<Success<Regions, NoSuchElementError>>(Success.of<Regions, NoSuchElementError>(regions));
    }, async () => {
      const trial2: Try<Regions, NoSuchElementError | DataSourceError> = await this.regionMySQLQuery.all();

      return trial2.match<Promise<Try<Regions, NoSuchElementError | DataSourceError>>>(async (regions: Regions) => {
        await this.regionCommand.insertAll(regions);

        return Success.of<Regions, NoSuchElementError>(regions);
      }, (err: NoSuchElementError | DataSourceError) => {
        return Promise.resolve<Failure<Regions, NoSuchElementError | DataSourceError>>(Failure.of<Regions, NoSuchElementError | DataSourceError>(err));
      });
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>> {
    const trial: Try<Regions, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Try<Region, NoSuchElementError | DataSourceError>>((regions: Regions) => {
      const found: Region | undefined = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      if (found === undefined) {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      }

      return Success.of<Region, NoSuchElementError>(found);
    }, (err: NoSuchElementError | DataSourceError) => {
      return Failure.of<Region, NoSuchElementError | DataSourceError>(err);
    });
  }
}
