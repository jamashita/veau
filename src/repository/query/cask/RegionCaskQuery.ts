import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { Regions } from '../../../domain/vo/Region/Regions';
import { IRegionCommand } from '../../command/interface/IRegionCommand';
import { ARegionQuery } from '../abstract/ARegionQuery';
import { IRegionQuery } from '../interface/IRegionQuery';
import { ICaskQuery } from './ICaskQuery';

@injectable()
export class RegionCaskQuery extends ARegionQuery<DataSourceError, 'Cask'> implements IRegionQuery, ICaskQuery {
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
    super();
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
}
