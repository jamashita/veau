import * as log4js from 'log4js';
import { Stats } from '../veau-entity/Stats';
import { StatsOutline } from '../veau-entity/StatsOutline';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { NotFoundError } from '../veau-error/NotFoundError';
import { ITransaction } from '../veau-general/MySQL/ITransaction';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsQuery } from '../veau-query/StatsQuery';
import { StatsUpdateTransaction } from '../veau-transaction/StatsUpdateTransaction';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

const logger: log4js.Logger = log4js.getLogger();

const statsQuery: StatsQuery = StatsQuery.getInstance();

const LIMIT: number = 40;

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

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOutline>> {
    const limit: number = LIMIT;
    const offset: number = (page - 1) * LIMIT;

    return statsQuery.findByVeauAccountID(veauAccountID, limit, offset);
  }

  public save(veauAccountID: VeauAccountID, stats: Stats): Promise<any> {
    const statsUpdateTransaction: ITransaction = StatsUpdateTransaction.getInstance(veauAccountID, stats);

    return veauMySQL.transact(statsUpdateTransaction);
  }
}
