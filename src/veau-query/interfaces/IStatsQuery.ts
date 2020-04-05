import { Stats } from '../../veau-entity/Stats';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsError } from '../../veau-error/StatsError';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { IQuery } from './IQuery';

export interface IStatsQuery extends IQuery {
  readonly noun: 'StatsQuery';

  findByStatsID(statsID: StatsID): Promise<Try<Stats, NoSuchElementError | StatsError>>;
}
