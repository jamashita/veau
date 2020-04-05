import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { StatsValuesError } from '../veau-error/StatsValuesError';
import { Try } from '../veau-general/Try/Try';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValues } from '../veau-vo/StatsValues';
import { IStatsValueQuery } from './interfaces/IStatsValueQuery';
import { StatsValueQuery as StatsValueMySQLQuery } from './MySQL/StatsValueQuery';

@injectable()
export class StatsValueQuery implements IStatsValueQuery {
  private statsValueMySQLQuery: StatsValueMySQLQuery;

  public constructor(@inject(TYPE.StatsValueMySQLQuery) statsValueMySQLQuery: StatsValueMySQLQuery) {
    this.statsValueMySQLQuery = statsValueMySQLQuery;
  }

  public findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError>> {
    return this.statsValueMySQLQuery.findByStatsID(statsID);
  }
}
