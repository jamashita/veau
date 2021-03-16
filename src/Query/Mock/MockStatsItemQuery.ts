import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { StatsItems } from '../../Entity/StatsItem/StatsItems';
import { StatsItemError } from '../../VO/StatsItem/Error/StatsItemError';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsItemQuery implements IStatsItemQuery, IMockQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<StatsItems, StatsItemError | DataSourceError> {
    throw new UnimplementedError();
  }
}
