import { StatsItems } from '../../Entity/StatsItems';
import { StatsItemsError } from '../../Error/StatsItemsError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { UnimplementedError } from '../../General/UnimplementedError';
import { StatsID } from '../../VO/StatsID';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';

export class MockStatsItemQuery implements IStatsItemQuery, IMockQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByStatsID(statsID: StatsID): Promise<Superposition<StatsItems, StatsItemsError | DataSourceError>> {
    return Promise.reject<Superposition<StatsItems, StatsItemsError | DataSourceError>>(new UnimplementedError());
  }
}
