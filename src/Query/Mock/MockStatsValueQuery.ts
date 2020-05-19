import { DataSourceError, Project, Superposition, UnimplementedError } from 'publikum';

import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsValuesError } from '../../VO/StatsValue/Error/StatsValuesError';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Promise<
    Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>
  > {
    return Promise.reject<Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>>(
      new UnimplementedError()
    );
  }
}
