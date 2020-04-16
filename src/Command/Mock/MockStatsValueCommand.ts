import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { IMockCommand } from '../Interface/IMockCommand';
import { IStatsValueCommand } from '../Interface/IStatsValueCommand';

export class MockStatsValueCommand implements IStatsValueCommand, IMockCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'Mock' = 'Mock';

  public async create(): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  public async deleteByStatsID(): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
