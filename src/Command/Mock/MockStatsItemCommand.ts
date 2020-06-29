import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { IStatsItemCommand } from '../Interface/IStatsItemCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockStatsItemCommand implements IStatsItemCommand, IMockCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }

  public deleteByStatsID(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }
}
