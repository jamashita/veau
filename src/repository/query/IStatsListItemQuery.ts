import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Page } from '../../../domain/vo/Page/Page.js';
import { StatsListItemError } from '../../../domain/vo/StatsListItem/error/StatsListItemError.js';
import { StatsListItems } from '../../../domain/vo/StatsListItem/StatsListItems.js';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID.js';
import { IQuery } from './IQuery.js';

export interface IStatsListItemQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsListItemQuery'> {
  readonly noun: 'StatsListItemQuery';

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsListItems, E | StatsListItemError>;
}
