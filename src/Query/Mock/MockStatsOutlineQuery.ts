import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { StatsOutlineError } from '../../domain/VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutline } from '../../domain/VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../domain/VO/StatsOutline/StatsOutlines';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsOutlineQuery implements IStatsOutlineQuery, IMockQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'Mock' = 'Mock';

  public find(): Superposition<StatsOutline, DataSourceError | NoSuchElementError | StatsOutlineError> {
    throw new UnimplementedError();
  }

  public findByVeauAccountID(): Superposition<StatsOutlines, DataSourceError | StatsOutlineError> {
    throw new UnimplementedError();
  }
}
