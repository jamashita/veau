import { StatsItem } from '../../Entity/StatsItem';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { StatsID } from '../../VO/StatsID';
import { ICommand } from './ICommand';

export interface IStatsItemCommand extends ICommand {
  readonly noun: 'StatsItemCommand';

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Try<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>>;
}
