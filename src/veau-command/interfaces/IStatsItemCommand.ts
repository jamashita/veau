import { StatsItem } from '../../veau-entity/StatsItem';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { ICommand } from './ICommand';

export interface IStatsItemCommand<E extends Error> extends ICommand {
  readonly noun: 'StatsItemCommand';

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Try<void, E>>;

  deleteByStatsID(statsID: StatsID): Promise<Try<void, E>>;
}