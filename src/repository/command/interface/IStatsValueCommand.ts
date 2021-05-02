import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { StatsItemID } from '../../domain/vo/StatsItem/StatsItemID';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID';
import { StatsValue } from '../../domain/vo/StatsValue/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsValueCommand'> {
  readonly noun: 'StatsValueCommand';

  create(statsItemID: StatsItemID, statsValue: StatsValue): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
