import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

import { IStatsValueCommand } from '../Interface/IStatsValueCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockStatsValueCommand implements IStatsValueCommand, IMockCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }

  public deleteByStatsID(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }
}
