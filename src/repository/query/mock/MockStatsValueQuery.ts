import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Project } from '@jamashita/lluvia-collection';
import { StatsItemID } from '../../../domain/vo/StatsItem/StatsItemID';
import { StatsValueError } from '../../../domain/vo/StatsValue/error/StatsValueError';
import { StatsValues } from '../../../domain/vo/StatsValue/StatsValues';
import { IStatsValueQuery } from '../interface/IStatsValueQuery';
import { IMockQuery } from './IMockQuery';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<Project<StatsItemID, StatsValues>, DataSourceError | StatsValueError> {
    throw new UnimplementedError();
  }
}
