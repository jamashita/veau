import { StatsValuesError } from '../../veau-error/StatsValuesError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValues } from '../../veau-vo/StatsValues';
import { IMockQuery } from '../Interfaces/IMockQuery';
import { IStatsValueQuery } from '../Interfaces/IStatsValueQuery';

export class MockStatsValueQuery implements IStatsValueQuery, IMockQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError | DataSourceError>> {
    return Promise.reject<Try<StatsValues, StatsValuesError | DataSourceError>>(new UnimplementedError());
  }
}
