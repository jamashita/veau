import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { IStatsCommand } from '../Interface/IStatsCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockStatsCommand implements IStatsCommand, IMockCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }

  public deleteByStatsID(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }
}
