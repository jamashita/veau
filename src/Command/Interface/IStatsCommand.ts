import { Stats } from '../../Entity/Stats';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { StatsID } from '../../VO/StatsID';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { ICommand } from './ICommand';

export interface IStatsCommand extends ICommand {
  readonly noun: 'StatsCommand';

  create(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Superposition<void, DataSourceError>>;
}
