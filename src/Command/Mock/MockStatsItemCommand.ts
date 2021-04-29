import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore';
import { IStatsItemCommand } from '../Interface/IStatsItemCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockStatsItemCommand<E extends DataSourceError = DataSourceError> implements IStatsItemCommand<E>, IMockCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, E> {
    throw new UnimplementedError();
  }

  public deleteByStatsID(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
