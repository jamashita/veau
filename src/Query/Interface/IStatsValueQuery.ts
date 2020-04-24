import { DataSourceError, Superposition } from 'publikum';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { StatsID } from '../../VO/StatsID';
import { StatsValues } from '../../VO/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery extends IQuery {
  readonly noun: 'StatsValueQuery';

  findByStatsID(statsID: StatsID): Promise<Superposition<StatsValues, StatsValuesError | DataSourceError>>;
}
