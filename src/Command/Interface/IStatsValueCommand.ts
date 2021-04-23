import { DataSourceError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';

import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValue } from '../../VO/StatsValue/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand<E extends DataSourceError = DataSourceError> extends ICommand<'StatsValueCommand'> {
  readonly noun: 'StatsValueCommand';

  create(statsItemID: StatsItemID, statsValue: StatsValue): Superposition<unknown, E>;

  deleteByStatsID(statsID: StatsID): Superposition<unknown, E>;
}
