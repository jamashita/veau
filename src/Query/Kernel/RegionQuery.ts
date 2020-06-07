import { inject, injectable } from 'inversify';

import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Alive, Dead, Quantum, Superposition } from '@jamashita/publikum-monad';

import { IRegionCommand } from '../../Command/Interface/IRegionCommand';
import { Type } from '../../Container/Types';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IKernelQuery } from './Interface/IKernelQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IKernelQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly regionMySQLQuery: IRegionQuery;
  private readonly regionRedisQuery: IRegionQuery;
  private readonly regionRedisCommand: IRegionCommand;

  public constructor(
    @inject(Type.RegionMySQLQuery) regionMySQLQuery: IRegionQuery,
    @inject(Type.RegionRedisQuery) regionRedisQuery: IRegionQuery,
    @inject(Type.RegionRedisCommand) regionRedisCommand: IRegionCommand
  ) {
    this.regionMySQLQuery = regionMySQLQuery;
    this.regionRedisQuery = regionRedisQuery;
    this.regionRedisCommand = regionRedisCommand;
  }

  public async all(): Promise<Superposition<Regions, RegionsError | DataSourceError>> {
    const superposition1: Superposition<Regions, RegionsError | DataSourceError> = await this.regionRedisQuery.all();

    return superposition1.transform<Regions, RegionsError | DataSourceError>(
      (regions: Regions, self: Alive<Regions, RegionsError | DataSourceError>) => {
        return Promise.resolve<Superposition<Regions, RegionsError | DataSourceError>>(self);
      },
      async () => {
        const superposition2: Superposition<
          Regions,
          RegionsError | DataSourceError
        > = await this.regionMySQLQuery.all();

        return superposition2.transform<Regions, RegionsError | DataSourceError>(
          async (regions: Regions) => {
            const superposition3: Superposition<unknown, DataSourceError> = await this.regionRedisCommand.insertAll(
              regions
            );

            return superposition3.transform<Regions, DataSourceError>(
              () => {
                return Alive.of<Regions, DataSourceError>(regions);
              },
              (err: DataSourceError, self: Dead<unknown, DataSourceError>) => {
                return self.transpose<Regions>();
              }
            );
          },
          (err: RegionsError | DataSourceError, self: Dead<Regions, RegionsError | DataSourceError>) => {
            return Promise.resolve<Superposition<Regions, RegionsError | DataSourceError>>(self);
          }
        );
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(regionID: RegionID): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public async findByISO3166(
    iso3166: ISO3166
  ): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Regions, RegionsError | DataSourceError> = await this.all();

    return superposition.transform<Region, RegionError | NoSuchElementError | DataSourceError>(
      (regions: Regions) => {
        const quantum: Quantum<Region> = regions.find((region: Region) => {
          return region.getISO3166().equals(iso3166);
        });

        return quantum.toSuperposition().transform<Region, NoSuchElementError | DataSourceError>(
          (region: Region) => {
            return Alive.of<Region, DataSourceError>(region);
          },
          () => {
            return Dead.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
          }
        );
      },
      (err: RegionsError | DataSourceError) => {
        if (err instanceof RegionsError) {
          return Dead.of<Region, RegionError>(new RegionError('RegionQuery.findByISO3166()', err));
        }

        return Dead.of<Region, DataSourceError>(err);
      }
    );
  }
}
