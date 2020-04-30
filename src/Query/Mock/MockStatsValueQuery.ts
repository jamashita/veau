import { DataSourceError, Project, Superposition, UnimplementedError } from 'publikum';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { StatsID } from '../../VO/StatsID';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsValues } from '../../VO/StatsValues';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByStatsID(statsID: StatsID): Promise<Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>> {
    return Promise.reject<Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>>(new UnimplementedError());
  }
}
