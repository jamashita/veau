import { StatsOverview } from '../../veau-entity/StatsOverview';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsOverviewRepository {

  findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverview>>;

  create(veauAccountID: VeauAccountID, statsOverview: StatsOverview): Promise<any>;
}
