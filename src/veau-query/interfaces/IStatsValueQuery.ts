import { StatsValuesError } from '../../veau-error/StatsValuesError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValues } from '../../veau-vo/StatsValues';
import { IQuery } from './IQuery';

export interface IStatsValueQuery extends IQuery {
  readonly noun: 'StatsValueQuery';

  findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError | DataSourceError>>;
}
