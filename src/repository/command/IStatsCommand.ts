import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Stats } from '../../domain/entity/Stats/Stats.js';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID.js';
import { VeauAccountID } from '../../domain/vo/VeauAccount/VeauAccountID.js';
import { ICommand } from './ICommand.js';

export interface IStatsCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsCommand'> {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
