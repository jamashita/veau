import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore';
import { StatsItems } from '../../domain/Entity/StatsItem/StatsItems';
import { StatsItemError } from '../../domain/VO/StatsItem/Error/StatsItemError';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsItemQuery implements IStatsItemQuery, IMockQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<StatsItems, DataSourceError | StatsItemError> {
    throw new UnimplementedError();
  }
}
