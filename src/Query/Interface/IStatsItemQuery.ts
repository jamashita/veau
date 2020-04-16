import { StatsItems } from '../../Entity/StatsItems';
import { StatsItemsError } from '../../Error/StatsItemsError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { StatsID } from '../../VO/StatsID';
import { IQuery } from './IQuery';

export interface IStatsItemQuery extends IQuery {
  readonly noun: 'StatsItemQuery';

  findByStatsID(statsID: StatsID): Promise<Try<StatsItems, StatsItemsError | DataSourceError>>;
}
