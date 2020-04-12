import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { StatsID } from '../../VO/StatsID';
import { StatsValue } from '../../VO/StatsValue';
import { IMockCommand } from '../Interface/IMockCommand';
import { IStatsValueCommand } from '../Interface/IStatsValueCommand';

export class MockStatsValueCommand implements IStatsValueCommand, IMockCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(statsValue: StatsValue): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
