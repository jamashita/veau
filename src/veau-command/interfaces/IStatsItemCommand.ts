import { StatsItem } from '@/veau-entity/StatsItem';
import { StatsID } from '@/veau-vo/StatsID';

export interface IStatsItemCommand {

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<any>;

  deleteByStatsID(statsID: StatsID): Promise<any>;
}
