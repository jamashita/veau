import { StatsItems } from '../../veau-entity/StatsItems';
import { StatsItemsError } from '../../veau-error/StatsItemsError';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';

export interface IStatsItemQuery {

  findByStatsID(statsID: StatsID): Promise<Try<StatsItems, StatsItemsError>>;
}
