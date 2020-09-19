import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsError } from '../../VO/StatsOutline/Error/StatsError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsQuery } from '../Interface/IStatsQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsQuery implements IStatsQuery, IMockQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }
}
