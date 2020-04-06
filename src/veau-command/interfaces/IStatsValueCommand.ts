import { SourceError } from '../../veau-general/SourceError';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { ICommand } from './ICommand';

export interface IStatsValueCommand<E extends SourceError> extends ICommand {
  readonly noun: 'StatsValueCommand';

  create(statsValue: StatsValue): Promise<Try<void, E>>;

  deleteByStatsID(statsID: StatsID): Promise<Try<void, E>>;
}
