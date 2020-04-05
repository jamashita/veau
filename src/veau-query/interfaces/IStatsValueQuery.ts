import { StatsValuesError } from '../../veau-error/StatsValuesError';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValues } from '../../veau-vo/StatsValues';

export interface IStatsValueQuery {

  findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError>>;
}
