import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Project } from '@jamashita/lluvia-collection';
import { StatsItemID } from '../../../domain/vo/StatsItem/StatsItemID';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { StatsValueError } from '../../../domain/vo/StatsValue/error/StatsValueError';
import { StatsValues } from '../../../domain/vo/StatsValue/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsValueQuery'> {
  readonly noun: 'StatsValueQuery';

  findByStatsID(statsID: StatsID): Superposition<Project<StatsItemID, StatsValues>, E | StatsValueError>;
}
