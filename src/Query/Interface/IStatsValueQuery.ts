import { Project } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValuesError } from '../../VO/StatsValue/Error/StatsValuesError';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery extends IQuery {
  readonly noun: 'StatsValueQuery';

  findByStatsID(
    statsID: StatsID
  ): Promise<Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>>;
}
