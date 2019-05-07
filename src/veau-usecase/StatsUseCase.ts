import * as log4js from 'log4js';
import { IStatsCommand } from '../veau-command/interfaces/IStatsCommand';
import { IStatsItemCommand } from '../veau-command/interfaces/IStatsItemCommand';
import { IStatsValueCommand } from '../veau-command/interfaces/IStatsValueCommand';
import { StatsItemMySQLCommand } from '../veau-command/StatsItemMySQLCommand';
import { StatsMySQLCommand } from '../veau-command/StatsMySQLCommand';
import { StatsValueMySQLCommand } from '../veau-command/StatsValueMySQLCommand';
import { Stats, StatsJSON } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { NotFoundError } from '../veau-error/NotFoundError';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IStatsQuery } from '../veau-query/interfaces/IStatsQuery';
import { StatsMySQLQuery } from '../veau-query/StatsMySQLQuery';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

const logger: log4js.Logger = log4js.getLogger();

export class StatsUseCase {
  private static instance: StatsUseCase = new StatsUseCase();
  private static statsQuery: IStatsQuery = StatsMySQLQuery.getInstance();
  private static statsFactory: StatsFactory = StatsFactory.getInstance();

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

  public save(veauAccountID: VeauAccountID, json: StatsJSON): Promise<any> {
    const stats: Stats = StatsUseCase.statsFactory.fromJSON(json);

    return VeauMySQL.transaction(async (transaction: Transaction): Promise<any> => {
      const statsCommand: IStatsCommand = StatsMySQLCommand.getInstance(transaction);
      const statsItemCommand: IStatsItemCommand = StatsItemMySQLCommand.getInstance(transaction);
      const statsValueCommand: IStatsValueCommand = StatsValueMySQLCommand.getInstance(transaction);

      const statsID: StatsID = stats.getStatsID();

      await Promise.all<any>([
        statsValueCommand.deleteByStatsID(statsID),
        statsItemCommand.deleteByStatsID(statsID),
        statsCommand.deleteByStatsID(statsID)
      ]);

      const promises: Array<Promise<any>> = [];

      promises.push(statsCommand.create(stats, veauAccountID));

      stats.getItems().forEach((statsItem: StatsItem, index: number) => {
        promises.push(statsItemCommand.create(stats.getStatsID(), statsItem, index + 1));

        statsItem.getValues().forEach((statsValue: StatsValue) => {
          promises.push(statsValueCommand.create(statsItem.getStatsItemID(), statsValue));
        });
      });

      return Promise.all<any>(promises);
    });
  }
}
