import { Stats, StatsJSON } from '../veau-entity/Stats';
import { IStatsRepository, StatsRepository } from '../veau-repository/StatsRepository';
import { StatsID } from '../veau-vo/StatsID';
import { UUID } from '../veau-vo/UUID';

const statsRepository: IStatsRepository = StatsRepository.getInstance();

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
}

export interface IStatsUsecase {

  findByStatsID(statsID: string): Promise<StatsJSON>;
}
