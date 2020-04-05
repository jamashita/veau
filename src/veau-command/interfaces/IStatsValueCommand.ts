import { StatsID } from '../../veau-vo/StatsID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand extends ICommand {
  readonly noun: 'StatsValueCommand';

  create(statsValue: StatsValue): Promise<unknown>;

  deleteByStatsID(statsID: StatsID): Promise<unknown>;
}
