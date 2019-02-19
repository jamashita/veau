import { Stats } from '../../veau-entity/Stats';
import { Transaction } from '../../veau-general/MySQL/Transaction';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsRepository {

  findByStatsID(statsID: StatsID): Promise<Stats>;

  create(stats: Stats, veauAccountID: VeauAccountID, transaction: Transaction): Promise<any>;

  deleteByStatsID(statsID: StatsID, transaction: Transaction): Promise<any>;
}
