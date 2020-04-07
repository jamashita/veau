import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { StatsOutlinesError } from '../veau-error/StatsOutlinesError';
import { DataSourceError } from '../veau-general/DataSourceError';
import { Try } from '../veau-general/Try/Try';
import { Limit } from '../veau-vo/Limit';
import { Offset } from '../veau-vo/Offset';
import { StatsOutlines } from '../veau-vo/StatsOutlines';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsOutlineQuery } from './interfaces/IStatsOutlineQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'Complex' = 'Complex';
  private readonly statsOutlineQuery: IStatsOutlineQuery;

  public constructor(@inject(TYPE.StatsOutlineMySQLQuery) statsOutlineMySQLQuery: IStatsOutlineQuery) {
    this.statsOutlineQuery = statsOutlineMySQLQuery;
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, limit: Limit, offset: Offset): Promise<Try<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    return this.statsOutlineQuery.findByVeauAccountID(veauAccountID, limit, offset);
  }
}
