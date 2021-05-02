import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IStatsOutlineQuery } from '../interface/IStatsOutlineQuery';
import { IMockQuery } from './interface/IMockQuery';

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
