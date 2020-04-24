import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { StatsID } from '../../VO/StatsID';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsQuery } from '../Interface/IStatsQuery';

export class MockStatsQuery implements IStatsQuery, IMockQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByStatsID(statsID: StatsID): Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }
}
