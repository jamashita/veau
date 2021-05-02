import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Page } from '../../domain/VO/Page/Page';
import { StatsListItemError } from '../../domain/VO/StatsListItem/Error/StatsListItemError';
import { StatsListItems } from '../../domain/VO/StatsListItem/StatsListItems';
import { VeauAccountID } from '../../domain/VO/VeauAccount/VeauAccountID';
import { IQuery } from './IQuery';

export interface IStatsListItemQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsListItemQuery'> {
  readonly noun: 'StatsListItemQuery';

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsListItems, E | StatsListItemError>;
}
