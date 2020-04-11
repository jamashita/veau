import { StatsOutlinesError } from '../../veau-error/StatsOutlinesError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { Page } from '../../veau-vo/Page';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { IQuery } from './IQuery';

export interface IStatsOutlineQuery extends IQuery {
  readonly noun: 'StatsOutlineQuery';

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Try<StatsOutlines, StatsOutlinesError | DataSourceError>>;
}
