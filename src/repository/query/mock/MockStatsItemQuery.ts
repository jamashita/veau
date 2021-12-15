import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatsItems } from '../../../domain/entity/StatsItem/StatsItems.js';
import { StatsItemError } from '../../../domain/vo/StatsItem/error/StatsItemError.js';
import { IStatsItemQuery } from '../IStatsItemQuery.js';
import { IMockQuery } from './IMockQuery.js';

export class MockStatsItemQuery implements IStatsItemQuery, IMockQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<StatsItems, DataSourceError | StatsItemError> {
    throw new UnimplementedError();
  }
}
