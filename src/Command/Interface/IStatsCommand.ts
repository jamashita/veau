import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Stats } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsCommand'> {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
