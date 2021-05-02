import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { StatsItems } from '../../domain/Entity/StatsItem/StatsItems';
import { StatsItemError } from '../../domain/VO/StatsItem/Error/StatsItemError';
import { StatsID } from '../../domain/VO/StatsOutline/StatsID';
import { IQuery } from './IQuery';

export interface IStatsItemQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsItemQuery'> {
  readonly noun: 'StatsItemQuery';

  findByStatsID(statsID: StatsID): Superposition<StatsItems, E | StatsItemError>;
}
