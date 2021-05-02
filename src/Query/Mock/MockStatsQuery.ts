import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Stats } from '../../domain/Entity/Stats/Stats';
import { StatsError } from '../../domain/VO/StatsOutline/Error/StatsError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsQuery } from '../Interface/IStatsQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockStatsQuery implements IStatsQuery, IMockQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByStatsID(): Superposition<Stats, DataSourceError | NoSuchElementError | StatsError> {
    throw new UnimplementedError();
  }
}
