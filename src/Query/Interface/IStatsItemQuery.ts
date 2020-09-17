import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { StatsItems } from '../../Entity/StatsItem/StatsItems';
import { StatsItemError } from '../../VO/StatsItem/Error/StatsItemError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IQuery } from './IQuery';

export interface IStatsItemQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsItemQuery'> {
  readonly noun: 'StatsItemQuery';

  findByStatsID(statsID: StatsID): Superposition<StatsItems, StatsItemError | E>;
}
