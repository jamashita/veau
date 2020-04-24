import { DataSourceError, Superposition } from 'publikum';
import { Stats } from '../../Entity/Stats';
import { StatsID } from '../../VO/StatsID';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand extends ICommand {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Superposition<void, DataSourceError>>;
}
