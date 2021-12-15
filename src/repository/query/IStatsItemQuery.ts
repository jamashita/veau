import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatsItems } from '../../domain/entity/StatsItem/StatsItems.js';
import { StatsItemError } from '../../domain/vo/StatsItem/error/StatsItemError.js';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID.js';
import { IQuery } from './IQuery.js';

export interface IStatsItemQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsItemQuery'> {
  readonly noun: 'StatsItemQuery';

  findByStatsID(statsID: StatsID): Superposition<StatsItems, E | StatsItemError>;
}
