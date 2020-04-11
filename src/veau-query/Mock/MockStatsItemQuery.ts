import { StatsItems } from '../../veau-entity/StatsItems';
import { StatsItemsError } from '../../veau-error/StatsItemsError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { StatsID } from '../../veau-vo/StatsID';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';

export class MockStatsItemQuery implements IStatsItemQuery, IMockQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByStatsID(statsID: StatsID): Promise<Try<StatsItems, StatsItemsError | DataSourceError>> {
    return Promise.reject<Try<StatsItems, StatsItemsError | DataSourceError>>(new UnimplementedError());
  }
}
