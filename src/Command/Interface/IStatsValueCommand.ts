import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { StatsID } from '../../VO/StatsID';
import { StatsValue } from '../../VO/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand extends ICommand {
  readonly noun: 'StatsValueCommand';

  create(statsValue: StatsValue): Promise<Try<void, DataSourceError>>;

  deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>>;
}
