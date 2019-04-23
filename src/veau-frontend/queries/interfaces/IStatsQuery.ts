import { Stats } from '../../../veau-entity/Stats';
import { StatsID } from '../../../veau-vo/StatsID';

export interface IStatsQuery {

  findByStatsID(statsID: StatsID): Promise<Stats>;
}
