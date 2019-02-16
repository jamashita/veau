import { StatsItem } from '../../veau-entity/StatsItem';
import { MySQLTransaction } from '../../veau-general/MySQL/MySQLTransaction';
import { StatsID } from '../../veau-vo/StatsID';

export interface IStatsItemRepository {

  findByStatsID(statsID: StatsID): Promise<Array<StatsItem>>;

  create(statsID: StatsID, statsItem: StatsItem, seq: number, transactin: MySQLTransaction): Promise<any>;

  deleteByStatsID(statsID: StatsID, transaction: MySQLTransaction): Promise<any>;
}
