import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Project } from '@jamashita/lluvia-project';
import { StatsItemID } from '../../domain/vo/StatsItem/StatsItemID.js';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID.js';
import { StatsValueError } from '../../domain/vo/StatsValue/error/StatsValueError.js';
import { StatsValues } from '../../domain/vo/StatsValue/StatsValues.js';
import { IQuery } from './IQuery.js';

export interface IStatsValueQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsValueQuery'> {
  readonly noun: 'StatsValueQuery';

  findByStatsID(statsID: StatsID): Superposition<Project<StatsItemID, StatsValues>, E | StatsValueError>;
}
