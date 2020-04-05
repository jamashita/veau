import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { StatsItems } from '../veau-entity/StatsItems';
import { StatsItemsError } from '../veau-error/StatsItemsError';
import { Try } from '../veau-general/Try/Try';
import { StatsID } from '../veau-vo/StatsID';
import { IStatsItemQuery } from './interfaces/IStatsItemQuery';

@injectable()
export class StatsItemQuery implements IStatsItemQuery {
  private statsItemQuery: IStatsItemQuery;

  public constructor(@inject(TYPE.StatsItemMySQLQuery) statsItemQuery: IStatsItemQuery) {
    this.statsItemQuery = statsItemQuery;
  }

  public findByStatsID(statsID: StatsID): Promise<Try<StatsItems, StatsItemsError>> {
    return this.statsItemQuery.findByStatsID(statsID);
  }
}
