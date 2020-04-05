import { StatsItems } from '../../veau-entity/StatsItems';
import { StatsItemsError } from '../../veau-error/StatsItemsError';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { IQuery } from './IQuery';

export interface IStatsItemQuery extends IQuery {
  readonly noun: 'StatsItemQuery';

  findByStatsID(statsID: StatsID): Promise<Try<StatsItems, StatsItemsError>>;
}
