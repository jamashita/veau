import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValue } from '../../VO/StatsValue/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand extends ICommand {
  readonly noun: 'StatsValueCommand';

  create(statsItemID: StatsItemID, statsValue: StatsValue): Promise<Superposition<unknown, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Superposition<unknown, DataSourceError>>;
}
