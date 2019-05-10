import * as log4js from 'log4js';
import { Stats, StatsJSON } from '../veau-entity/Stats';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { NotFoundError } from '../veau-error/NotFoundError';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IStatsQuery } from '../veau-query/interfaces/IStatsQuery';
import { StatsMySQLQuery } from '../veau-query/StatsMySQLQuery';
import { StatsUpdateTransaction } from '../veau-transaction/StatsUpdateTransaction';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

const logger: log4js.Logger = log4js.getLogger();

export class StatsUseCase {
  private static instance: StatsUseCase = new StatsUseCase();
  private static statsQuery: IStatsQuery = StatsMySQLQuery.getInstance();

  public static getInstance(): StatsUseCase {
    return StatsUseCase.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<StatsJSON> {
    try {
      const stats: Stats = await StatsUseCase.statsQuery.findByStatsID(statsID);

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

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsJSON>> {
    const statistics: Array<Stats> = await StatsUseCase.statsQuery.findByVeauAccountID(veauAccountID, page);

    return statistics.map<StatsJSON>((stats: Stats) => {
      return stats.toJSON();
    })
  }

  public save(veauAccountID: VeauAccountID, stats: Stats): Promise<any> {
    const statsUpdateTransaction: Transaction = StatsUpdateTransaction.getInstance(veauAccountID, stats);

    return VeauMySQL.transact(statsUpdateTransaction);
  }
}
