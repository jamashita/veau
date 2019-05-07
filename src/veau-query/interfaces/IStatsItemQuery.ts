import { StatsItem } from '@/veau-entity/StatsItem';
import { StatsID } from '@/veau-vo/StatsID';

export interface IStatsItemQuery {

  findByStatsID(statsID: StatsID): Promise<Array<StatsItem>>;
}
