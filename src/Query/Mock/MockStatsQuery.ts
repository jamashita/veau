import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { StatsID } from '../../VO/StatsID';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsQuery } from '../Interface/IStatsQuery';

export class MockStatsQuery implements IStatsQuery, IMockQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByStatsID(statsID: StatsID): Promise<Try<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Try<Stats, StatsError | NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }
}
