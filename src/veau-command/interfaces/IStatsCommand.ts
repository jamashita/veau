import { Stats } from '../../veau-entity/Stats';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand extends ICommand {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Promise<unknown>;

  deleteByStatsID(statsID: StatsID): Promise<unknown>;
}
