import { Project } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValueError } from '../../VO/StatsValue/Error/StatsValueError';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsValueQuery'> {
  readonly noun: 'StatsValueQuery';

  findByStatsID(statsID: StatsID): Superposition<Project<StatsItemID, StatsValues>, StatsValueError | E>;
}
