import { DataSourceError, Superposition } from 'publikum';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { Page } from '../../VO/Page/Page';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IQuery } from './IQuery';

export interface IStatsOutlineQuery extends IQuery {
  readonly noun: 'StatsOutlineQuery';

  find(
    statsID: StatsID
  ): Promise<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>>;

  findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>>;
}
