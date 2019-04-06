import { StatsValues } from '../../veau-collection/StatsValues';
import { Transaction } from '../../veau-general/MySQL/Transaction';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';

export interface IStatsValueRepository {

  findByStatsID(statsID: StatsID): Promise<Map<string, StatsValues>>;

  create(statsItemID: StatsItemID, statsValue: StatsValue, transaction: Transaction): Promise<any>;

  deleteByStatsID(statsID: StatsID, transaction: Transaction): Promise<any>;
}
