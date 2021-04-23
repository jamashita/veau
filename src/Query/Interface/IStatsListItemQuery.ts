import { DataSourceError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { Page } from '../../VO/Page/Page';
import { StatsListItemError } from '../../VO/StatsListItem/Error/StatsListItemError';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IQuery } from './IQuery';

export interface IStatsListItemQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsListItemQuery'> {
  readonly noun: 'StatsListItemQuery';

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsListItems, E | StatsListItemError>;
}
