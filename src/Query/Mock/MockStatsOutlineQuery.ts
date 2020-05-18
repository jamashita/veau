import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsOutlineError } from '../../Error/StatsOutlineError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { Page } from '../../VO/Page';
import { StatsID } from '../../VO/StatsID';
import { StatsOutline } from '../../VO/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { IMockQuery } from '../Interface/IMockQuery';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';

export class MockStatsOutlineQuery implements IStatsOutlineQuery, IMockQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'Mock' = 'Mock';

  public find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    statsID: StatsID
  ): Promise<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public findByVeauAccountID(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    veauAccountID: VeauAccountID,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page: Page
  ): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    return Promise.reject<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>>(new UnimplementedError());
  }
}
