import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

import { Stats } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { StatsError } from '../../Entity/Stats/Error/StatsError';
import { IMockQuery } from './Interface/IMockQuery';
import { IStatsQuery } from '../Interface/IStatsQuery';

export class MockStatsQuery implements IStatsQuery, IMockQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }
}
