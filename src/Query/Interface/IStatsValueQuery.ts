import { DataSourceError, Project, Superposition } from 'publikum';

import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsValuesError } from '../../VO/StatsValue/Error/StatsValuesError';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery extends IQuery {
  readonly noun: 'StatsValueQuery';

  findByStatsID(
    statsID: StatsID
  ): Promise<Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>>;
}
