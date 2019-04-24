import { StatsOverview, StatsOverviewJSON } from '../../veau-entity/StatsOverview';
import { StatsOverviewFactory } from '../../veau-factory/StatsOverviewFactory';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { IStatsOverviewQuery } from './interfaces/IStatsOverviewQuery';

export class StatsOverviewAJAXQuery implements IStatsOverviewQuery {
  private static instance: StatsOverviewAJAXQuery = new StatsOverviewAJAXQuery();
  private static statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();

  public static getInstance(): StatsOverviewAJAXQuery {
    return StatsOverviewAJAXQuery.instance;
  }

  private constructor() {
  }

  public async findByPage(page: number): Promise<Array<StatsOverview>> {
    const response: AJAXResponse<Array<StatsOverviewJSON>> = await AJAX.get(`/api/stats/overview/${page}`);

    return response.body.map<StatsOverview>((json: StatsOverviewJSON) => {
      return StatsOverviewAJAXQuery.statsOverviewFactory.fromJSON(json);
    });
  }
}
