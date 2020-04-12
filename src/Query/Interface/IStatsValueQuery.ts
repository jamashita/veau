import { StatsValuesError } from '../../Error/StatsValuesError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { StatsID } from '../../VO/StatsID';
import { StatsValues } from '../../VO/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery extends IQuery {
  readonly noun: 'StatsValueQuery';

  findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError | DataSourceError>>;
}
