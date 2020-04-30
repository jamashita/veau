import { DataSourceError, Project, Superposition } from 'publikum';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { StatsID } from '../../VO/StatsID';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsValues } from '../../VO/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery extends IQuery {
  readonly noun: 'StatsValueQuery';

  findByStatsID(statsID: StatsID): Promise<Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>>;
}
