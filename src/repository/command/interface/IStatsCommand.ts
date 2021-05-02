import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Stats } from '../../domain/entity/Stats/Stats';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID';
import { VeauAccountID } from '../../domain/vo/VeauAccount/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsCommand'> {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
