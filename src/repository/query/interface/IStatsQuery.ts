import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Stats } from '../../../domain/entity/Stats/Stats';
import { StatsError } from '../../../domain/vo/StatsOutline/error/StatsError';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IStatsQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsQuery'> {
  readonly noun: 'StatsQuery';

  findByStatsID(statsID: StatsID): Superposition<Stats, E | NoSuchElementError | StatsError>;
}
