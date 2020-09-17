import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { StatsError } from '../../Entity/Stats/Error/StatsError';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IStatsQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsQuery'> {
  readonly noun: 'StatsQuery';

  findByStatsID(statsID: StatsID): Superposition<Stats, StatsError | NoSuchElementError | E>;
}
