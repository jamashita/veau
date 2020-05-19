import { DataSourceError, Superposition } from 'publikum';

import { Stats } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand extends ICommand {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<unknown, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Superposition<unknown, DataSourceError>>;
}
