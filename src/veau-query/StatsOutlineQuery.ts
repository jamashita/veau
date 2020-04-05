import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { StatsOutlinesError } from '../veau-error/StatsOutlinesError';
import { Try } from '../veau-general/Try/Try';
import { Limit } from '../veau-vo/Limit';
import { Offset } from '../veau-vo/Offset';
import { StatsOutlines } from '../veau-vo/StatsOutlines';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsOutlineQuery } from './interfaces/IStatsOutlineQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery {
  private statsOutlineQuery: IStatsOutlineQuery;

  public constructor(@inject(TYPE.StatsOutlineMySQLQuery) statsOutlineMySQLQuery: IStatsOutlineQuery) {
    this.statsOutlineQuery = statsOutlineMySQLQuery;
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, limit: Limit, offset: Offset): Promise<Try<StatsOutlines, StatsOutlinesError>> {
    return this.statsOutlineQuery.findByVeauAccountID(veauAccountID, limit, offset);
  }
}
