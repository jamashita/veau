import { IStatsOverviewCommand } from '../veau-command/interfaces/IStatsOverviewCommand';
import { StatsMySQLCommand } from '../veau-command/StatsMySQLCommand';
import { StatsOverviewMySQLCommand } from '../veau-command/StatsOverviewMySQLCommand';
import { Stats, StatsJSON } from '../veau-entity/Stats';
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
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsUsecase } from './interfaces/IStatsUsecase';

export class StatsUsecase implements IStatsUsecase {
  private static instance: StatsUsecase = new StatsUsecase();
  private static statsQuery: IStatsQuery = StatsMySQLQuery.getInstance();
  private static statsFactory: StatsFactory = StatsFactory.getInstance();
  private static statsOverviewQuery: IStatsOverviewQuery = StatsOverviewMySQLQuery.getInstance();
  private static statsOverviewCommand: IStatsOverviewCommand = StatsOverviewMySQLCommand.getInstance();
  private static statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();

  public static getInstance(): StatsUsecase {
    return StatsUsecase.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<StatsJSON> {
    const stats: Stats = await StatsUsecase.statsQuery.findByStatsID(statsID);

    return stats.toJSON();
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverviewJSON>> {
    const statsOverviews: Array<StatsOverview> = await StatsUsecase.statsOverviewQuery.findByVeauAccountID(veauAccountID, page);

    return statsOverviews.map<StatsOverviewJSON>((statsOverview: StatsOverview) => {
      return statsOverview.toJSON();
    });
  }

  public saveNewStats(veauAccountID: VeauAccountID, json: StatsOverviewJSON): Promise<any> {
    const statsOverview: StatsOverview = StatsUsecase.statsOverviewFactory.fromJSON(json);

    return StatsUsecase.statsOverviewCommand.create(veauAccountID, statsOverview);
  }

  public save(veauAccountID: VeauAccountID, json: StatsJSON): Promise<any> {
    const stats: Stats = StatsUsecase.statsFactory.fromJSON(json);

    return VeauMySQL.transaction(async (transaction: Transaction): Promise<any> => {
      const statsCommand: StatsMySQLCommand = StatsMySQLCommand.getInstance(transaction);

      await statsCommand.deleteByStatsID(stats.getStatsID());

      return statsCommand.create(stats, veauAccountID);
    });
  }
}
