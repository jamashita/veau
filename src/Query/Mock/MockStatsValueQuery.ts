import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { StatsID } from '../../VO/StatsID';
import { StatsValues } from '../../VO/StatsValues';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByStatsID(statsID: StatsID): Promise<Superposition<StatsValues, StatsValuesError | DataSourceError>> {
    return Promise.reject<Superposition<StatsValues, StatsValuesError | DataSourceError>>(new UnimplementedError());
  }
}
