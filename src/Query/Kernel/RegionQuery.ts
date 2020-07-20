import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { inject, injectable } from 'inversify';

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

  public all(): Superposition<Regions, RegionsError | DataSourceError> {
    return this.regionRedisQuery.all().recover<Regions, RegionsError | DataSourceError>(() => {
      return this.regionMySQLQuery.all().map<Regions, RegionsError | DataSourceError>((regions: Regions) => {
        return this.regionRedisCommand.insertAll(regions).map<Regions, DataSourceError>(() => {
          return regions;
        });
      });
    }, DataSourceError);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_regionID: RegionID): Superposition<Region, RegionError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, RegionError | NoSuchElementError | DataSourceError> {
    return this.all().map<Region, RegionsError | DataSourceError | UnscharferelationError>((regions: Regions) => {
      const region: Nullable<Region> = regions.find((r: Region) => {
        return r.getISO3166().equals(iso3166);
      });

      return Unscharferelation.maybe<Region>(region).toSuperposition();
    }).recover<Region, RegionError | NoSuchElementError | DataSourceError>(
      (err: RegionsError | DataSourceError | UnscharferelationError) => {
        if (err instanceof RegionsError) {
          throw new RegionError('RegionQuery.findByISO3166()', err);
        }
        if (err instanceof UnscharferelationError) {
          throw new NoSuchElementError(iso3166.toString());
        }

        throw err;
      },
      RegionError,
      NoSuchElementError,
      DataSourceError
    );
  }
}
