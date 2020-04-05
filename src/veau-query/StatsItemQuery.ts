import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { StatsItems } from '../veau-entity/StatsItems';
import { StatsItemsError } from '../veau-error/StatsItemsError';
import { Try } from '../veau-general/Try/Try';
import { StatsID } from '../veau-vo/StatsID';
import { IStatsItemQuery } from './interfaces/IStatsItemQuery';
import { StatsItemQuery as StatsItemMySQLQuery } from './MySQL/StatsItemQuery';

@injectable()
export class StatsItemQuery implements IStatsItemQuery {
  private statsItemMySQLQuery: StatsItemMySQLQuery;

  public constructor(@inject(TYPE.StatsItemMySQLQuery) statsItemMySQLQuery: StatsItemMySQLQuery) {
    this.statsItemMySQLQuery = statsItemMySQLQuery;
  }

  public findByStatsID(statsID: StatsID): Promise<Try<StatsItems, StatsItemsError>> {
    return this.statsItemMySQLQuery.findByStatsID(statsID);
  }
}
