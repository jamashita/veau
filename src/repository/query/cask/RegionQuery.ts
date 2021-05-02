import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { Region } from '../../../domain/vo/Region/Region';
import { RegionID } from '../../../domain/vo/Region/RegionID';
import { Regions } from '../../../domain/vo/Region/Regions';
import { IRegionCommand } from '../../command/interface/IRegionCommand';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IRegionQuery } from '../interface/IRegionQuery';
import { RegionQueryFindByISO3166 } from '../trait/RegionQueryFindByISO3166';
import { ICaskQuery } from './ICaskQuery';

@injectable()
export class RegionQuery implements IRegionQuery, ICaskQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Cask' = 'Cask';
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

  public all(): Superposition<Regions, DataSourceError | RegionError> {
    return this.redisQuery.all().recover<Regions, DataSourceError | RegionError>(() => {
      return this.mysqlQuery.all().map<Regions, DataSourceError | RegionError>((regions: Regions) => {
        return this.redisCommand.insertAll(regions).map<Regions, DataSourceError>(() => {
          return regions;
        });
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_regionID: RegionID): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    throw new UnimplementedError();
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    return RegionQueryFindByISO3166.of(this.all()).findByISO3166(iso3166);
  }
}
