import { StatsJSON } from '../../veau-entity/Stats';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsUseCase {

  findByStatsID(statsID: StatsID): Promise<StatsJSON>;

  findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsJSON>>;

  save(veauAccountID: VeauAccountID, json: StatsJSON): Promise<any>;
}
