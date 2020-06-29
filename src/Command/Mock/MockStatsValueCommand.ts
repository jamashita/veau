import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { IStatsValueCommand } from '../Interface/IStatsValueCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockStatsValueCommand implements IStatsValueCommand, IMockCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }

  public deleteByStatsID(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }
}
