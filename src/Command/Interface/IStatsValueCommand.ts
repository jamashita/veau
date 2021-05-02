import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { StatsItemID } from '../../domain/VO/StatsItem/StatsItemID';
import { StatsID } from '../../domain/VO/StatsOutline/StatsID';
import { StatsValue } from '../../domain/VO/StatsValue/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsValueCommand'> {
  readonly noun: 'StatsValueCommand';

  create(statsItemID: StatsItemID, statsValue: StatsValue): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
