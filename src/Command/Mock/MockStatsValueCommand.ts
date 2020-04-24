import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { IMockCommand } from '../Interface/IMockCommand';
import { IStatsValueCommand } from '../Interface/IStatsValueCommand';

export class MockStatsValueCommand implements IStatsValueCommand, IMockCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'Mock' = 'Mock';

  public async create(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }

  public async deleteByStatsID(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }
}
