import { StatsOverview } from '../../../veau-entity/StatsOverview';

export interface IStatsOverviewQuery {

  findByPage(page: number): Promise<Array<StatsOverview>>;
}
