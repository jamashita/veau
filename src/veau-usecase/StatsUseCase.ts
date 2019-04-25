import { IStatsCommand } from '../veau-command/interfaces/IStatsCommand';
import { IStatsItemCommand } from '../veau-command/interfaces/IStatsItemCommand';
import { IStatsOverviewCommand } from '../veau-command/interfaces/IStatsOverviewCommand';
import { IStatsValueCommand } from '../veau-command/interfaces/IStatsValueCommand';
import { StatsItemMySQLCommand } from '../veau-command/StatsItemMySQLCommand';
import { StatsMySQLCommand } from '../veau-command/StatsMySQLCommand';
import { StatsOverviewMySQLCommand } from '../veau-command/StatsOverviewMySQLCommand';
import { StatsValueMySQLCommand } from '../veau-command/StatsValueMySQLCommand';
import { Stats, StatsJSON } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { StatsOverview, StatsOverviewJSON } from '../veau-entity/StatsOverview';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IStatsOverviewQuery } from '../veau-query/interfaces/IStatsOverviewQuery';
import { IStatsQuery } from '../veau-query/interfaces/IStatsQuery';
import { StatsMySQLQuery } from '../veau-query/StatsMySQLQuery';
import { StatsOverviewMySQLQuery } from '../veau-query/StatsOverviewMySQLQuery';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsUseCase } from './interfaces/IStatsUseCase';

export class StatsUseCase implements IStatsUseCase {
  private static instance: StatsUseCase = new StatsUseCase();
  private static statsQuery: IStatsQuery = StatsMySQLQuery.getInstance();
  private static statsFactory: StatsFactory = StatsFactory.getInstance();
  private static statsOverviewQuery: IStatsOverviewQuery = StatsOverviewMySQLQuery.getInstance();
  private static statsOverviewCommand: IStatsOverviewCommand = StatsOverviewMySQLCommand.getInstance();
  private static statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();

  public static getInstance(): StatsUseCase {
    return StatsUseCase.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<StatsJSON> {
    const stats: Stats = await StatsUseCase.statsQuery.findByStatsID(statsID);

    return stats.toJSON();
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverviewJSON>> {
    const statsOverviews: Array<StatsOverview> = await StatsUseCase.statsOverviewQuery.findByVeauAccountID(veauAccountID, page);

    return statsOverviews.map<StatsOverviewJSON>((statsOverview: StatsOverview) => {
      return statsOverview.toJSON();
    });
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
