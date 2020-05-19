import { DataSourceError, Superposition } from 'publikum';
import { Stats } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IQuery } from './IQuery';

export interface IStatsQuery extends IQuery {
  readonly noun: 'StatsQuery';

  findByStatsID(statsID: StatsID): Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>>;
}
