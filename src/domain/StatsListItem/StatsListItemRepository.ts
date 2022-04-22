import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { Page } from '../Page/Page';
import { VeauAccountID } from '../VeauAccount/VeauAccountID';
import { StatsListItemError } from './StatsListItemError';
import { StatsListItems } from './StatsListItems';

export interface StatsListItemRepository<E extends DataSourceError = DataSourceError> {
  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Schrodinger<StatsListItems, E | StatsListItemError>>;
}
