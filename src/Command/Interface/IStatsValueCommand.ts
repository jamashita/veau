import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { StatsID } from '../../VO/StatsID';
import { StatsValue } from '../../VO/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand extends ICommand {
  readonly noun: 'StatsValueCommand';

  create(statsValue: StatsValue): Promise<Superposition<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Superposition<void, DataSourceError>>;
}
