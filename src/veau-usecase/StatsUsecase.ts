import { Stats, StatsJSON } from '../veau-entity/Stats';
import { StatsOverview, StatsOverviewJSON } from '../veau-entity/StatsOverview';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { IStatsOverviewRepository, StatsOverviewRepository } from '../veau-repository/StatsOverviewRepository';
import { IStatsRepository, StatsRepository } from '../veau-repository/StatsRepository';
import { StatsID } from '../veau-vo/StatsID';
import { UUID } from '../veau-vo/UUID';

const statsRepository: IStatsRepository = StatsRepository.getInstance();
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

  public async findByPage(page: number): Promise<Array<StatsOverviewJSON>> {
    const statsOverviews: Array<StatsOverview> = await statsOverviewRepository.findByPage(page);

    return statsOverviews.map<StatsOverviewJSON>((statsOverview: StatsOverview) => {
      return statsOverview.toJSON();
    });
  }

  public saveNewStats(json: StatsOverviewJSON): Promise<void> {
    const statsOverview: StatsOverview = statsOverviewFactory.fromJSON(json);

    return statsOverviewRepository.create(statsOverview);
  }
}

export interface IStatsUsecase {

  findByStatsID(statsID: string): Promise<StatsJSON>;

  findByPage(page: number): Promise<Array<StatsOverviewJSON>>;

  saveNewStats(json: StatsOverviewJSON): Promise<void>;
}
