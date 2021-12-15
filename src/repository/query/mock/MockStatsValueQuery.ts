import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Project } from '@jamashita/lluvia-project';
import { StatsItemID } from '../../../domain/vo/StatsItem/StatsItemID.js';
import { StatsValueError } from '../../../domain/vo/StatsValue/error/StatsValueError.js';
import { StatsValues } from '../../../domain/vo/StatsValue/StatsValues.js';
import { IStatsValueQuery } from '../IStatsValueQuery.js';
import { IMockQuery } from './IMockQuery.js';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<Project<StatsItemID, StatsValues>, DataSourceError | StatsValueError> {
    throw new UnimplementedError();
  }
}
