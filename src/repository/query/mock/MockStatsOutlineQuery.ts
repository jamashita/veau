import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError.js';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline.js';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IStatsOutlineQuery } from '../IStatsOutlineQuery.js';
import { IMockQuery } from './IMockQuery.js';

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
