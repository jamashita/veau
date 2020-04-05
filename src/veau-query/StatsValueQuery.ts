import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { StatsValuesError } from '../veau-error/StatsValuesError';
import { Try } from '../veau-general/Try/Try';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValues } from '../veau-vo/StatsValues';
import { IStatsValueQuery } from './interfaces/IStatsValueQuery';

@injectable()
export class StatsValueQuery implements IStatsValueQuery {
  private readonly statsValueQuery: IStatsValueQuery;

  public constructor(@inject(TYPE.StatsValueMySQLQuery) statsValueQuery: IStatsValueQuery) {
    this.statsValueQuery = statsValueQuery;
  }

  public findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError>> {
    return this.statsValueQuery.findByStatsID(statsID);
  }
}
