import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { StatsID } from '../StatsOutline/StatsID';
import { StatsItem } from './StatsItem';
import { StatsItemError } from './StatsItemError';

export interface StatsItemRepository<E extends DataSourceError = DataSourceError> {
  create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Schrodinger<unknown, E>>;

  deleteByStatsID(statsID: StatsID): Promise<Schrodinger<unknown, E>>;

  findByStatsID(statsID: StatsID): Promise<Schrodinger<StatsItem, E | StatsItemError>>;
}
