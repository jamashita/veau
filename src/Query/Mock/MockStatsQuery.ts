import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { StatsError } from '../../Entity/Stats/Error/StatsError';
import { Stats } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsQuery } from '../Interface/IStatsQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsQuery implements IStatsQuery, IMockQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }
}
