import { StatsID } from '../../veau-vo/StatsID';
import { StatsValue } from '../../veau-vo/StatsValue';

export interface IStatsValueCommand {

  create(statsValue: StatsValue): Promise<unknown>;

  deleteByStatsID(statsID: StatsID): Promise<unknown>;
}
