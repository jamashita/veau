import { DataSourceError, Superposition } from 'publikum';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { ICommand } from './ICommand';

export interface IStatsItemCommand extends ICommand {
  readonly noun: 'StatsItemCommand';

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Superposition<unknown, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Superposition<unknown, DataSourceError>>;
}
