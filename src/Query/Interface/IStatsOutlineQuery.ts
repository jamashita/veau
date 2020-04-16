import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { Page } from '../../VO/Page';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { IQuery } from './IQuery';

export interface IStatsOutlineQuery extends IQuery {
  readonly noun: 'StatsOutlineQuery';

  findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>>;
}
