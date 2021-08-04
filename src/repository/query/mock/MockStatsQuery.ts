import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Stats } from '../../../domain/entity/Stats/Stats.js';
import { StatsError } from '../../../domain/vo/StatsOutline/error/StatsError.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IStatsQuery } from '../IStatsQuery.js';
import { IMockQuery } from './IMockQuery.js';

export class MockStatsQuery implements IStatsQuery, IMockQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<Stats, DataSourceError | NoSuchElementError | StatsError> {
    throw new UnimplementedError();
  }
}
