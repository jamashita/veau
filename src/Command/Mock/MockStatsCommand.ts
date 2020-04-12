import { Stats } from '../../Entity/Stats';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { StatsID } from '../../VO/StatsID';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { IMockCommand } from '../Interface/IMockCommand';
import { IStatsCommand } from '../Interface/IStatsCommand';

export class MockStatsCommand implements IStatsCommand, IMockCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public create(stats: Stats, veauAccountID: VeauAccountID): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
