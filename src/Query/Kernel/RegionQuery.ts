import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Quantum, Superposition, UnimplementedError } from 'publikum';
import { IRegionCommand } from '../../Command/Interface/IRegionCommand';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionError } from '../../Error/RegionError';
import { RegionsError } from '../../Error/RegionsError';
import { ISO3166 } from '../../VO/ISO3166';
import { Region } from '../../VO/Region';
import { RegionID } from '../../VO/RegionID';
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

  public async all(): Promise<Superposition<Regions, RegionsError | DataSourceError>> {
    const superposition1: Superposition<Regions, RegionsError | DataSourceError> = await this.regionRedisQuery.all();

    return superposition1.match<Regions, RegionsError | DataSourceError>((regions: Regions, self: Alive<Regions, RegionsError | DataSourceError>) => {
      return Promise.resolve<Superposition<Regions, RegionsError | DataSourceError>>(self);
    }, async () => {
      const superposition2: Superposition<Regions, RegionsError | DataSourceError> = await this.regionMySQLQuery.all();

      return superposition2.match<Regions, RegionsError | DataSourceError>(async (regions: Regions) => {
        const superposition3: Superposition<void, DataSourceError> = await this.regionRedisCommand.insertAll(regions);

        return superposition3.match<Regions, DataSourceError>(() => {
          return Alive.of<Regions, DataSourceError>(regions);
        }, (err: DataSourceError, self: Dead<void, DataSourceError>) => {
          return self.transpose<Regions>();
        });
      }, (err: RegionsError | DataSourceError, self: Dead<Regions, RegionsError | DataSourceError>) => {
        return Promise.resolve<Superposition<Regions, RegionsError | DataSourceError>>(self);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(regionID: RegionID): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Regions, RegionsError | DataSourceError> = await this.all();

    return superposition.match<Region, RegionError | NoSuchElementError | DataSourceError>((regions: Regions) => {
      const quantum: Quantum<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      return quantum.toSuperposition().match<Region, NoSuchElementError | DataSourceError>((region: Region) => {
        return Alive.of<Region, DataSourceError>(region);
      }, () => {
        return Dead.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      });
    }, (err: RegionsError | DataSourceError) => {
      if (err instanceof RegionsError) {
        return Dead.of<Region, RegionError>(new RegionError('RegionQuery.findByISO3166()', err));
      }

      return Dead.of<Region, DataSourceError>(err);
    });
  }
}
