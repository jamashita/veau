import { StatsMySQLCommand } from '../veau-command/StatsMySQLCommand';
import { StatsOverviewMySQLCommand } from '../veau-command/StatsOverviewMySQLCommand';
import { Stats, StatsJSON } from '../veau-entity/Stats';
import { StatsOverview, StatsOverviewJSON } from '../veau-entity/StatsOverview';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IStatsQuery } from '../veau-query/interfaces/IStatsQuery';
import { StatsMySQLQuery } from '../veau-query/StatsMySQLQuery';
import { StatsOverviewMySQLQuery } from '../veau-query/StatsOverviewMySQLQuery';
import { StatsID } from '../veau-vo/StatsID';
import { UUID } from '../veau-vo/UUID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsUsecase } from './interfaces/IStatsUsecase';

const statsFactory: StatsFactory = StatsFactory.getInstance();
const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();

export class StatsUsecase implements IStatsUsecase {
  private static instance: StatsUsecase = new StatsUsecase();

  public static getInstance(): StatsUsecase {
    return StatsUsecase.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: string): Promise<StatsJSON> {
    const statsQuery: IStatsQuery = StatsMySQLQuery.getInstance();
    const stats: Stats = await statsQuery.findByStatsID(StatsID.of(UUID.of(statsID)));

    return stats.toJSON();
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverviewJSON>> {
    const statsOverviewQuery: StatsOverviewMySQLQuery = StatsOverviewMySQLQuery.getInstance();
    const statsOverviews: Array<StatsOverview> = await statsOverviewQuery.findByVeauAccountID(veauAccountID, page);

    return statsOverviews.map<StatsOverviewJSON>((statsOverview: StatsOverview) => {
      return statsOverview.toJSON();
    });
  }

  public saveNewStats(veauAccountID: VeauAccountID, json: StatsOverviewJSON): Promise<any> {
    const statsOverviewCommand: StatsOverviewMySQLCommand = StatsOverviewMySQLCommand.getInstance();
    const statsOverview: StatsOverview = statsOverviewFactory.fromJSON(json);

    return statsOverviewCommand.create(veauAccountID, statsOverview);
  }

  public save(veauAccountID: VeauAccountID, json: StatsJSON): Promise<any> {
    const stats: Stats = statsFactory.fromJSON(json);

    return VeauMySQL.transaction(async (transaction: Transaction): Promise<any> => {
      const statsCommand: StatsMySQLCommand = StatsMySQLCommand.getInstance(transaction);

      await statsCommand.deleteByStatsID(stats.getStatsID());

      return statsCommand.create(stats, veauAccountID);
    });
  }
}
