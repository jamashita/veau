import { StatsOverview } from '../../veau-entity/StatsOverview';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsOverviewCommand {

  create(veauAccountID: VeauAccountID, statsOverview: StatsOverview): Promise<any>;
}
