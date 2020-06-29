import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Page } from '../../VO/Page/Page';
import { StatsListItemsError } from '../../VO/StatsListItem/Error/StatsListItemsError';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IQuery } from './IQuery';

export interface IStatsListItemQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsListItemQuery'> {
  readonly noun: 'StatsListItemQuery';

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsListItems, StatsListItemsError | E>;
}
