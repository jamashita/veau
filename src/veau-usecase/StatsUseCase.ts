import * as log4js from 'log4js';
import { Stats, StatsJSON } from '../veau-entity/Stats';
import { StatsOutline, StatsOutlineJSON } from '../veau-entity/StatsOutline';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { NotFoundError } from '../veau-error/NotFoundError';
import { ITransaction } from '../veau-general/MySQL/ITransaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsQuery } from '../veau-query/StatsQuery';
import { StatsUpdateTransaction } from '../veau-transaction/StatsUpdateTransaction';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

const logger: log4js.Logger = log4js.getLogger();

const statsQuery: StatsQuery = StatsQuery.getInstance();

const LIMIT: number = 40;

export class StatsUseCase {
  private static instance: StatsUseCase = new StatsUseCase();

  public static getInstance(): StatsUseCase {
    return StatsUseCase.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<StatsJSON> {
    try {
      const stats: Stats = await statsQuery.findByStatsID(statsID);

      return stats.toJSON();
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

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOutlineJSON>> {
    const limit: number = LIMIT;
    const offset: number = (page - 1) * LIMIT;

    const statsOutlines: Array<StatsOutline> = await statsQuery.findByVeauAccountID(veauAccountID, limit, offset);

    return statsOutlines.map<StatsOutlineJSON>((statsOutline: StatsOutline) => {
      return statsOutline.toJSON();
    });
  }

  public save(veauAccountID: VeauAccountID, stats: Stats): Promise<any> {
    const statsUpdateTransaction: ITransaction = StatsUpdateTransaction.getInstance(veauAccountID, stats);

    return VeauMySQL.transact(statsUpdateTransaction);
  }
}
