import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { ICommand } from './ICommand';

export interface IStatsItemCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsItemCommand'> {
  readonly noun: 'StatsItemCommand';

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
