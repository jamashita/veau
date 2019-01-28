import { Stats, StatsJSON } from '../veau-entity/Stats';
import { StatsOverview, StatsOverviewJSON } from '../veau-entity/StatsOverview';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { MySQLTransaction } from '../veau-general/MySQLTransaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IStatsOverviewRepository, StatsOverviewRepository } from '../veau-repository/StatsOverviewRepository';
import { IStatsRepository, StatsRepository } from '../veau-repository/StatsRepository';
import { StatsID } from '../veau-vo/StatsID';
import { UUID } from '../veau-vo/UUID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

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

  public saveNewStats(json: StatsOverviewJSON): Promise<any> {
    const statsOverview: StatsOverview = statsOverviewFactory.fromJSON(json);

    return statsOverviewRepository.create(statsOverview);
  }

  public save(json: StatsJSON): Promise<any> {
    const stats: Stats = statsFactory.fromJSON(json);

    return VeauMySQL.transaction(async (transaction: MySQLTransaction): Promise<any> => {
      await statsRepository.deleteByStatsID(stats.getStatsID(), transaction);
      return statsRepository.create(stats, transaction);
    });
  }
}

export interface IStatsUsecase {

  findByStatsID(statsID: string): Promise<StatsJSON>;

  findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverviewJSON>>;

  saveNewStats(json: StatsOverviewJSON): Promise<any>;

  save(json: StatsJSON): Promise<any>;
}
