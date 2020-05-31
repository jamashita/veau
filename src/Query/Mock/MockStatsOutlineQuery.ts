import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsOutlineQuery implements IStatsOutlineQuery, IMockQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'Mock' = 'Mock';

  public find(): Promise<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public findByVeauAccountID(): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    return Promise.reject<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>>(new UnimplementedError());
  }
}
