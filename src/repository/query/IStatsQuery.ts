import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Stats } from '../../domain/entity/Stats/Stats.js';
import { StatsError } from '../../domain/vo/StatsOutline/error/StatsError.js';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID.js';
import { NoSuchElementError } from './error/NoSuchElementError.js';
import { IQuery } from './IQuery.js';

export interface IStatsQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsQuery'> {
  readonly noun: 'StatsQuery';

  findByStatsID(statsID: StatsID): Superposition<Stats, E | NoSuchElementError | StatsError>;
}
