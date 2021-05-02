import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Stats } from '../../../domain/entity/Stats/Stats';
import { StatsError } from '../../../domain/vo/StatsOutline/error/StatsError';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IStatsQuery } from '../interface/IStatsQuery';
import { IMockQuery } from './IMockQuery';

export class MockStatsQuery implements IStatsQuery, IMockQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<Stats, DataSourceError | NoSuchElementError | StatsError> {
    throw new UnimplementedError();
  }
}
