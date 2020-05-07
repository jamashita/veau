import { DataSourceError, Superposition } from 'publikum';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsOutlineError } from '../../Error/StatsOutlineError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { Page } from '../../VO/Page';
import { StatsID } from '../../VO/StatsID';
import { StatsOutline } from '../../VO/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { IQuery } from './IQuery';

export interface IStatsOutlineQuery extends IQuery {
  readonly noun: 'StatsOutlineQuery';

  find(statsID: StatsID): Promise<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>>;

  findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>>;
}
