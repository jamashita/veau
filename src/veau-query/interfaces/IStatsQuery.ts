import { Stats } from '../../veau-entity/Stats';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsQuery {

  findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<Stats>>;

  findByStatsID(statsID: StatsID): Promise<Stats>;
}
