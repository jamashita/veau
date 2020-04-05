import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { Stats } from '../veau-entity/Stats';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { StatsError } from '../veau-error/StatsError';
import { Try } from '../veau-general/Try/Try';
import { StatsID } from '../veau-vo/StatsID';
import { IStatsQuery } from './interfaces/IStatsQuery';

@injectable()
export class StatsQuery implements IStatsQuery {
  private statsQuery: IStatsQuery;

  public constructor(@inject(TYPE.StatsMySQLQuery) statsQuery: IStatsQuery) {
    this.statsQuery = statsQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<Try<Stats, NoSuchElementError | StatsError>> {
    return this.statsQuery.findByStatsID(statsID);
  }
}
