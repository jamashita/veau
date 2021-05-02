import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Page } from '../../../domain/vo/Page/Page';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IStatsOutlineQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsOutlineQuery'> {
  readonly noun: 'StatsOutlineQuery';

  find(statsID: StatsID): Superposition<StatsOutline, E | NoSuchElementError | StatsOutlineError>;

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, E | StatsOutlineError>;
}
