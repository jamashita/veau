import * as log4js from 'log4js';
import { StatsOutlines } from '../veau-entity/collection/StatsOutlines';
import { Stats } from '../veau-entity/Stats';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { NotFoundError } from '../veau-error/NotFoundError';
import { ITransaction } from '../veau-general/MySQL/ITransaction';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsOutlineQuery } from '../veau-query/StatsOutlineQuery';
import { StatsQuery } from '../veau-query/StatsQuery';
import { StatsUpdateTransaction } from '../veau-transaction/StatsUpdateTransaction';
import { Page } from '../veau-vo/Page';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

const logger: log4js.Logger = log4js.getLogger();

const statsQuery: StatsQuery = StatsQuery.getInstance();
const statsOutlineQuery: StatsOutlineQuery = StatsOutlineQuery.getInstance();

export class StatsInteractor {
  private static instance: StatsInteractor = new StatsInteractor();

  public static getInstance(): StatsInteractor {
    return StatsInteractor.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Stats> {
    try {
      const stats: Stats = await statsQuery.findByStatsID(statsID);

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
    return statsOutlineQuery.findByVeauAccountID(veauAccountID, page.getLimit(), page.getOffset());
  }

  public save(veauAccountID: VeauAccountID, stats: Stats): Promise<any> {
    const statsUpdateTransaction: ITransaction = StatsUpdateTransaction.getInstance(veauAccountID, stats);

    return veauMySQL.transact(statsUpdateTransaction);
  }
}
