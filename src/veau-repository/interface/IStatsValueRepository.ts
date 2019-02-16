import { MySQLTransaction } from '../../veau-general/MySQL/MySQLTransaction';
import { StatsValues } from '../../veau-vo/collection/StatsValues';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';

export interface IStatsValueRepository {

  findByStatsID(statsID: StatsID): Promise<Map<string, StatsValues>>;

  create(statsItemID: StatsItemID, statsValue: StatsValue, transaction: MySQLTransaction): Promise<any>;

  deleteByStatsID(statsID: StatsID, transaction: MySQLTransaction): Promise<any>;
}
