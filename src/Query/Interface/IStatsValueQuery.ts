import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Project } from '@jamashita/lluvia-collection';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValueError } from '../../VO/StatsValue/Error/StatsValueError';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsValueQuery'> {
  readonly noun: 'StatsValueQuery';

  findByStatsID(statsID: StatsID): Superposition<Project<StatsItemID, StatsValues>, E | StatsValueError>;
}
