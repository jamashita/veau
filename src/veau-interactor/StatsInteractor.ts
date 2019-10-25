import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { TYPE } from '../veau-container/Types';
import { Stats } from '../veau-entity/Stats';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { NotFoundError } from '../veau-error/NotFoundError';
import { ITransaction } from '../veau-general/MySQL/ITransaction';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { StatsOutlineQuery } from '../veau-query/StatsOutlineQuery';
import { StatsQuery } from '../veau-query/StatsQuery';
import { StatsUpdateTransaction } from '../veau-transaction/StatsUpdateTransaction';
import { Page } from '../veau-vo/Page';
import { StatsID } from '../veau-vo/StatsID';
import { StatsOutlines } from '../veau-vo/StatsOutlines';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

const logger: log4js.Logger = log4js.getLogger();

@injectable()
export class StatsInteractor {
  private mysql: MySQL;
  private statsQuery: StatsQuery;
  private statsOutlineQuery: StatsOutlineQuery;

  public constructor(
    @inject(TYPE.MySQL) mysql: MySQL,
    @inject(TYPE.StatsQuery) statsQuery: StatsQuery,
    @inject(TYPE.StatsOutlineQuery) statsOutlineQuery: StatsOutlineQuery
  ) {
    this.mysql = mysql;
    this.statsQuery = statsQuery;
    this.statsOutlineQuery = statsOutlineQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<Stats> {
    try {
      const stats: Stats = await this.statsQuery.findByStatsID(statsID);

      return stats;
    }
    catch (err) {
      if (err instanceof NoSuchElementError) {
        logger.error(err.message);

        throw new NotFoundError();
      }
      logger.fatal(err.toString());

      throw err;
    }
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<StatsOutlines> {
    return this.statsOutlineQuery.findByVeauAccountID(veauAccountID, page.getLimit(), page.getOffset());
  }

  public save(stats: Stats, veauAccountID: VeauAccountID): Promise<unknown> {
    const statsUpdateTransaction: ITransaction = StatsUpdateTransaction.of(stats, veauAccountID);

    return this.mysql.transact(statsUpdateTransaction);
  }
}
