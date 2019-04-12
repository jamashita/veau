import { Stats } from '../../veau-entity/Stats';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsCommand {

  create(stats: Stats, veauAccountID: VeauAccountID): Promise<any>;

  deleteByStatsID(statsID: StatsID): Promise<any>;
}
