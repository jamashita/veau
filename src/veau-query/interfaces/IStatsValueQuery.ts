import { StatsValues } from '@/veau-collection/StatsValues';
import { StatsID } from '@/veau-vo/StatsID';

export interface IStatsValueQuery {

  findByStatsID(statsID: StatsID): Promise<Map<string, StatsValues>>;
}
