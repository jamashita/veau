import { Stats } from '../../Entity/Stats';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { StatsID } from '../../VO/StatsID';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand extends ICommand {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Promise<Try<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>>;
}
