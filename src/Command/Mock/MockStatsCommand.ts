import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore';
import { IStatsCommand } from '../Interface/IStatsCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockStatsCommand<E extends DataSourceError = DataSourceError> implements IStatsCommand<E>, IMockCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, E> {
    throw new UnimplementedError();
  }

  public deleteByStatsID(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
