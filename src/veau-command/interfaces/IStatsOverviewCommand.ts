import { StatsOverview } from '../../veau-entity/StatsOverview';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsOverviewCommand {

  create(statsOverview: StatsOverview, veauAccountID: VeauAccountID): Promise<any>;
}
