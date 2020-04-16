import { StatsValuesError } from '../../Error/StatsValuesError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { StatsID } from '../../VO/StatsID';
import { StatsValues } from '../../VO/StatsValues';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError | DataSourceError>> {
    return Promise.reject<Try<StatsValues, StatsValuesError | DataSourceError>>(new UnimplementedError());
  }
}
