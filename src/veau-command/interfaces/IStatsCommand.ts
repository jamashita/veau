import { Stats } from '../../veau-entity/Stats';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand<E extends Error> extends ICommand {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Promise<Try<void, E>>;

  deleteByStatsID(statsID: StatsID): Promise<Try<unknown, E>>;
}
