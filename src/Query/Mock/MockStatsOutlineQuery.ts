import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsOutlineQuery implements IStatsOutlineQuery, IMockQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'Mock' = 'Mock';

  public find(): Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }

  public findByVeauAccountID(): Superposition<StatsOutlines, StatsOutlineError | DataSourceError> {
    throw new UnimplementedError();
  }
}
