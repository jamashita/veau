import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { inject, injectable } from 'inversify';
import { IRegionCommand } from '../../Command/Interface/IRegionCommand';
import { Type } from '../../Container/Types';
import { RegionError } from '../../VO/Region/Error/RegionError';
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
  private readonly mysqlQuery: IRegionQuery;
  private readonly redisQuery: IRegionQuery;
  private readonly redisCommand: IRegionCommand;

  public constructor(
    @inject(Type.RegionMySQLQuery) mysqlQuery: IRegionQuery,
    @inject(Type.RegionRedisQuery) redisQuery: IRegionQuery,
    @inject(Type.RegionRedisCommand) redisCommand: IRegionCommand
  ) {
    this.mysqlQuery = mysqlQuery;
    this.redisQuery = redisQuery;
    this.redisCommand = redisCommand;
  }

  public all(): Superposition<Regions, RegionError | DataSourceError> {
    return this.redisQuery.all().recover<Regions, RegionError | DataSourceError>(() => {
      return this.mysqlQuery.all().map<Regions, RegionError | DataSourceError>((regions: Regions) => {
        return this.redisCommand.insertAll(regions).map<Regions, DataSourceError>(() => {
          return regions;
        });
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_regionID: RegionID): Superposition<Region, RegionError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, RegionError | NoSuchElementError | DataSourceError> {
    return this.all().map<Region, RegionError | UnscharferelationError | DataSourceError>((regions: Regions) => {
      const region: Nullable<Region> = regions.find((r: Region) => {
        return r.getISO3166().equals(iso3166);
      });

      return Unscharferelation.maybe<Region>(region).toSuperposition();
    }).recover<Region, RegionError | NoSuchElementError | DataSourceError>((err: RegionError | UnscharferelationError | DataSourceError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(iso3166.toString());
      }

      throw err;
    }, RegionError, NoSuchElementError, DataSourceError);
  }
}
