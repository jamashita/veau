import { Project } from '@jamashita/publikum-collection';
import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsValuesError } from '../../VO/StatsValue/Error/StatsValuesError';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';
import { IMockQuery } from './Interface/IMockQuery';

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
