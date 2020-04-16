import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { UnimplementedError } from '../../General/UnimplementedError';
import { Page } from '../../VO/Page';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';

export class MockStatsOutlineQuery implements IStatsOutlineQuery, IMockQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    return Promise.reject<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>>(new UnimplementedError());
  }
}
