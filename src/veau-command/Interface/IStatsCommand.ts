import { Stats } from '../../veau-entity/Stats';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand extends ICommand {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Promise<Try<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>>;
}
