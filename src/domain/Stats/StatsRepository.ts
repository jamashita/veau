import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';
import { StatsError } from '../StatsOutline/StatsError';
import { StatsID } from '../StatsOutline/StatsID';
import { VeauAccountID } from '../VeauAccount/VeauAccountID';
import { Stats } from './Stats';

export interface StatsRepository<E extends DataSourceError = DataSourceError> {
  create(stats: Stats, veauAccountID: VeauAccountID): Promise<Schrodinger<unknown, E>>;

  delete(id: StatsID): Promise<Schrodinger<unknown, E>>;

  find(id: StatsID): Promise<Schrodinger<Stats, E | NoSuchElementError | StatsError>>;
}
