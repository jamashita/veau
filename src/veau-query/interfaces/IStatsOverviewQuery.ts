import { StatsOverview } from '../../veau-entity/StatsOverview';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsOverviewQuery {

  findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverview>>;
}
