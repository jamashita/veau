import { StatsItem } from '../../Entity/StatsItem';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { StatsID } from '../../VO/StatsID';
import { ICommand } from './ICommand';

export interface IStatsItemCommand extends ICommand {
  readonly noun: 'StatsItemCommand';

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Superposition<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Superposition<void, DataSourceError>>;
}
