import { DataSourceError, Superposition } from 'publikum';

import { Page } from '../../VO/Page/Page';
import { StatsListItemsError } from '../../VO/StatsListItem/Error/StatsListItemsError';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IQuery } from './IQuery';

export interface IStatsListItemQuery extends IQuery {
  readonly noun: 'StatsListItemQuery';

  findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsListItems, StatsListItemsError | DataSourceError>>;
}
