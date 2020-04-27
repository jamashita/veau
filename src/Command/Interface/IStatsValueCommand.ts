import { DataSourceError, Superposition } from 'publikum';
import { StatsID } from '../../VO/StatsID';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsValue } from '../../VO/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand extends ICommand {
  readonly noun: 'StatsValueCommand';

  create(statsItemID: StatsItemID, statsValue: StatsValue): Promise<Superposition<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Superposition<void, DataSourceError>>;
}
