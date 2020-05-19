import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

import { IMockCommand } from './Interface/IMockCommand';
import { IStatsCommand } from '../Interface/IStatsCommand';

export class MockStatsCommand implements IStatsCommand, IMockCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }

  public deleteByStatsID(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }
}
