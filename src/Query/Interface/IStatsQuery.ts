import { DataSourceError, Superposition } from 'publikum';
import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { StatsID } from '../../VO/StatsID';
import { IQuery } from './IQuery';

export interface IStatsQuery extends IQuery {
  readonly noun: 'StatsQuery';

  findByStatsID(statsID: StatsID): Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>>;
}
