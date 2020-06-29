import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Page } from '../../VO/Page/Page';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IStatsOutlineQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsOutlineQuery'> {
  readonly noun: 'StatsOutlineQuery';

  find(statsID: StatsID): Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | E>;

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, StatsOutlinesError | E>;
}
