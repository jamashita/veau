import { StatsItem } from '../../veau-entity/StatsItem';
import { Transaction } from '../../veau-general/MySQL/Transaction';
import { StatsID } from '../../veau-vo/StatsID';

export interface IStatsItemRepository {

  findByStatsID(statsID: StatsID): Promise<Array<StatsItem>>;

  create(statsID: StatsID, statsItem: StatsItem, seq: number, transactin: Transaction): Promise<any>;

  deleteByStatsID(statsID: StatsID, transaction: Transaction): Promise<any>;
}
