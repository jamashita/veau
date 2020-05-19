import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

import { IMockCommand } from './Interface/IMockCommand';
import { IStatsItemCommand } from '../Interface/IStatsItemCommand';

export class MockStatsItemCommand implements IStatsItemCommand, IMockCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }

  public deleteByStatsID(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }
}
