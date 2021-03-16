import { Project } from '@jamashita/publikum-collection';
import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsValueError } from '../../VO/StatsValue/Error/StatsValueError';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<Project<StatsItemID, StatsValues>, StatsValueError | DataSourceError> {
    throw new UnimplementedError();
  }
}
