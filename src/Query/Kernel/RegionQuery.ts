import { inject, injectable } from 'inversify';
import { IRegionCommand } from '../../Command/Interface/IRegionCommand';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Optional } from '../../General/Optional/Optional';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { ISO3166 } from '../../VO/ISO3166';
import { Region } from '../../VO/Region';
import { Regions } from '../../VO/Regions';
import { IKernelQuery } from '../Interface/IKernelQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IKernelQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly regionMySQLQuery: IRegionQuery;
  private readonly regionRedisQuery: IRegionQuery;
  private readonly regionRedisCommand: IRegionCommand;

  public constructor(
  @inject(TYPE.RegionMySQLQuery) regionMySQLQuery: IRegionQuery,
    @inject(TYPE.RegionRedisQuery) regionRedisQuery: IRegionQuery,
    @inject(TYPE.RegionRedisCommand) regionRedisCommand: IRegionCommand
  ) {
    this.regionMySQLQuery = regionMySQLQuery;
    this.regionRedisQuery = regionRedisQuery;
    this.regionRedisCommand = regionRedisCommand;
  }

  public async all(): Promise<Try<Regions, NoSuchElementError | DataSourceError>> {
    const trial1: Try<Regions, NoSuchElementError | DataSourceError> = await this.regionRedisQuery.all();

    return trial1.match<Regions, NoSuchElementError | DataSourceError>((regions: Regions) => {
      return Promise.resolve<Try<Regions, NoSuchElementError>>(Success.of<Regions, NoSuchElementError>(regions));
    }, async () => {
      const trial2: Try<Regions, NoSuchElementError | DataSourceError> = await this.regionMySQLQuery.all();

      return trial2.match<Regions, NoSuchElementError | DataSourceError>(async (regions: Regions) => {
        const trial3: Try<void, DataSourceError> = await this.regionRedisCommand.insertAll(regions);

        return trial3.match<Regions, DataSourceError>(() => {
          return Success.of<Regions, DataSourceError>(regions);
        }, (err: DataSourceError, self: Failure<void, DataSourceError>) => {
          return self.transpose<Regions>();
        });
      }, (err: NoSuchElementError | DataSourceError, self: Failure<Regions, NoSuchElementError | DataSourceError>) => {
        return Promise.resolve<Try<Regions, NoSuchElementError | DataSourceError>>(self);
      });
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>> {
    const trial: Try<Regions, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Region, NoSuchElementError | DataSourceError>((regions: Regions) => {
      const optional: Optional<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      return optional.toTry().match<Region, NoSuchElementError | DataSourceError>((region: Region) => {
        return Success.of<Region, DataSourceError>(region);
      }, () => {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      });
    }, (err: NoSuchElementError | DataSourceError, self: Failure<Regions, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Region>();
    });
  }
}
