import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { Stats } from '../../domain/Entity/Stats/Stats';
import { StatsID } from '../../domain/VO/StatsOutline/StatsID';
import { VeauAccountID } from '../../domain/VO/VeauAccount/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsCommand'> {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
