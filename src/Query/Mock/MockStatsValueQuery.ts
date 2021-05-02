import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore';
import { Project } from '@jamashita/lluvia-collection';
import { StatsItemID } from '../../domain/VO/StatsItem/StatsItemID';
import { StatsValueError } from '../../domain/VO/StatsValue/Error/StatsValueError';
import { StatsValues } from '../../domain/VO/StatsValue/StatsValues';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<Project<StatsItemID, StatsValues>, DataSourceError | StatsValueError> {
    throw new UnimplementedError();
  }
}
