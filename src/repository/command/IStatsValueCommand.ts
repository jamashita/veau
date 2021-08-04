import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatsItemID } from '../../../domain/vo/StatsItem/StatsItemID.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { StatsValue } from '../../../domain/vo/StatsValue/StatsValue.js';
import { ICommand } from './ICommand.js';

export interface IStatsValueCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsValueCommand'> {
  readonly noun: 'StatsValueCommand';

  create(statsItemID: StatsItemID, statsValue: StatsValue): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
