import { Stats, StatsJSON } from '../veau-entity/Stats';
import { StatsOverview, StatsOverviewJSON } from '../veau-entity/StatsOverview';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { MySQLTransaction } from '../veau-general/MySQL/MySQLTransaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IStatsOverviewRepository } from '../veau-repository/interface/IStatsOverviewRepository';
import { IStatsRepository } from '../veau-repository/interface/IStatsRepository';
import { StatsOverviewRepository } from '../veau-repository/StatsOverviewRepository';
import { StatsRepository } from '../veau-repository/StatsRepository';
import { StatsID } from '../veau-vo/StatsID';
import { UUID } from '../veau-vo/UUID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsUsecase } from './interface/IStatsUsecase';

const statsRepository: IStatsRepository = StatsRepository.getInstance();
const statsFactory: StatsFactory = StatsFactory.getInstance();
const statsOverviewRepository: IStatsOverviewRepository = StatsOverviewRepository.getInstance();
const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();

export class StatsUsecase implements IStatsUsecase {
  private static instance: StatsUsecase = new StatsUsecase();

  public static getInstance(): StatsUsecase {
    return StatsUsecase.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: string): Promise<StatsJSON> {
    const stats: Stats = await statsRepository.findByStatsID(StatsID.of(UUID.of(statsID)));

    return stats.toJSON();
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverviewJSON>> {
    const statsOverviews: Array<StatsOverview> = await statsOverviewRepository.findByVeauAccountID(veauAccountID, page);

    return statsOverviews.map<StatsOverviewJSON>((statsOverview: StatsOverview) => {
      return statsOverview.toJSON();
    });
  }

  public saveNewStats(veauAccountID: VeauAccountID, json: StatsOverviewJSON): Promise<any> {
    const statsOverview: StatsOverview = statsOverviewFactory.fromJSON(json);

    return statsOverviewRepository.create(veauAccountID, statsOverview);
  }

  public save(veauAccountID: VeauAccountID, json: StatsJSON): Promise<any> {
    const stats: Stats = statsFactory.fromJSON(json);

    return VeauMySQL.transaction(async (transaction: MySQLTransaction): Promise<any> => {
      await statsRepository.deleteByStatsID(stats.getStatsID(), transaction);
      return statsRepository.create(stats, veauAccountID, transaction);
    });
  }
}
