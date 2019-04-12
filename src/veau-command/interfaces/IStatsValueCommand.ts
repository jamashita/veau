import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';

export interface IStatsValueCommand {

  create(statsItemID: StatsItemID, statsValue: StatsValue): Promise<any>;

  deleteByStatsID(statsID: StatsID): Promise<any>;
}
