import { StatsItem } from '../../Entity/StatsItem';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { StatsID } from '../../VO/StatsID';
import { IMockCommand } from '../Interface/IMockCommand';
import { IStatsItemCommand } from '../Interface/IStatsItemCommand';

export class MockStatsItemCommand implements IStatsItemCommand, IMockCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
