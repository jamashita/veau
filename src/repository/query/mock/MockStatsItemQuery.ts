import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { StatsItems } from '../../../domain/entity/StatsItem/StatsItems';
import { StatsItemError } from '../../../domain/vo/StatsItem/error/StatsItemError';
import { IStatsItemQuery } from '../interface/IStatsItemQuery';
import { IMockQuery } from './IMockQuery';

export class MockStatsItemQuery implements IStatsItemQuery, IMockQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<StatsItems, DataSourceError | StatsItemError> {
    throw new UnimplementedError();
  }
}
