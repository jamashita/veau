import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsID } from '../../veau-vo/StatsID';
import { ICommand } from './ICommand';

export interface IStatsItemCommand extends ICommand {
  readonly noun: 'StatsItemCommand';

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<unknown>;

  deleteByStatsID(statsID: StatsID): Promise<unknown>;
}
