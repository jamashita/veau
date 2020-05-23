import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

import { StatsItems } from '../../Entity/StatsItem/StatsItems';
import { StatsItemsError } from '../../VO/StatsItem/Error/StatsItemsError';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsItemQuery implements IStatsItemQuery, IMockQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Promise<Superposition<StatsItems, StatsItemsError | DataSourceError>> {
    return Promise.reject<Superposition<StatsItems, StatsItemsError | DataSourceError>>(new UnimplementedError());
  }
}
