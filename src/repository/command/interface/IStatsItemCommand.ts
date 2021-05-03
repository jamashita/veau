import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { StatsItem } from '../../../domain/entity/StatsItem/StatsItem';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { ICommand } from './ICommand';

export interface IStatsItemCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsItemCommand'> {
  readonly noun: 'StatsItemCommand';

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
