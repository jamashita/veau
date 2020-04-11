import { StatsItem } from '../../veau-entity/StatsItem';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { ICommand } from './ICommand';

export interface IStatsItemCommand extends ICommand {
  readonly noun: 'StatsItemCommand';

  create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Try<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>>;
}
