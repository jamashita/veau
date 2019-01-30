import { StatsJSON } from '../veau-entity/Stats';
import { StatsOverviewJSON } from '../veau-entity/StatsOverview';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

export interface IStatsUsecase {

  findByStatsID(statsID: string): Promise<StatsJSON>;

  findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverviewJSON>>;

  saveNewStats(veauAccountID: VeauAccountID, json: StatsOverviewJSON): Promise<any>;

  save(veauAccountID: VeauAccountID, json: StatsJSON): Promise<any>;
}
