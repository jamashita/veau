import { StatsCommand } from '../veau-command/StatsCommand';
import { StatsOverviewCommand } from '../veau-command/StatsOverviewCommand';
import { Stats, StatsJSON } from '../veau-entity/Stats';
import { StatsOverview, StatsOverviewJSON } from '../veau-entity/StatsOverview';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IStatsQuery } from '../veau-query/interfaces/IStatsQuery';
import { StatsOverviewQuery } from '../veau-query/StatsOverviewQuery';
import { StatsQuery } from '../veau-query/StatsQuery';
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
    const statsQuery: IStatsQuery = StatsQuery.getInstance();
    const stats: Stats = await statsQuery.findByStatsID(StatsID.of(UUID.of(statsID)));

    return stats.toJSON();
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverviewJSON>> {
    const statsOverviewQuery: StatsOverviewQuery = StatsOverviewQuery.getInstance();
    const statsOverviews: Array<StatsOverview> = await statsOverviewQuery.findByVeauAccountID(veauAccountID, page);

    return statsOverviews.map<StatsOverviewJSON>((statsOverview: StatsOverview) => {
      return statsOverview.toJSON();
    });
  }

  public saveNewStats(veauAccountID: VeauAccountID, json: StatsOverviewJSON): Promise<any> {
    const statsOverviewCommand: StatsOverviewCommand = StatsOverviewCommand.getInstance();
    const statsOverview: StatsOverview = statsOverviewFactory.fromJSON(json);

    return statsOverviewCommand.create(veauAccountID, statsOverview);
  }

  public save(veauAccountID: VeauAccountID, json: StatsJSON): Promise<any> {
    const stats: Stats = statsFactory.fromJSON(json);

    return VeauMySQL.transaction(async (transaction: Transaction): Promise<any> => {
      const statsCommand: StatsCommand = StatsCommand.getInstance(transaction);

      await statsCommand.deleteByStatsID(stats.getStatsID());

      return statsCommand.create(stats, veauAccountID);
    });
  }
}
