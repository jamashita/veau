import { Stats } from '../../veau-entity/Stats';
import { MySQLTransaction } from '../../veau-general/MySQL/MySQLTransaction';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsRepository {

  findByStatsID(statsID: StatsID): Promise<Stats>;

  create(stats: Stats, veauAccountID: VeauAccountID, transaction: MySQLTransaction): Promise<any>;

  deleteByStatsID(statsID: StatsID, transaction: MySQLTransaction): Promise<any>;
}
