import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Stats } from '../../domain/Entity/Stats/Stats';
import { StatsError } from '../../domain/VO/StatsOutline/Error/StatsError';
import { StatsID } from '../../domain/VO/StatsOutline/StatsID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IStatsQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsQuery'> {
  readonly noun: 'StatsQuery';

  findByStatsID(statsID: StatsID): Superposition<Stats, E | NoSuchElementError | StatsError>;
}
