import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { StatsItems } from '../../Entity/StatsItem/StatsItems';
import { StatsItemsError } from '../../VO/StatsItem/Error/StatsItemsError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IQuery } from './IQuery';

export interface IStatsItemQuery extends IQuery {
  readonly noun: 'StatsItemQuery';

  findByStatsID(statsID: StatsID): Promise<Superposition<StatsItems, StatsItemsError | DataSourceError>>;
}
