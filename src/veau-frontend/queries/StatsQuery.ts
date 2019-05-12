import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { StatsID } from '../../veau-vo/StatsID';

const statsFactory: StatsFactory = StatsFactory.getInstance();

export class StatsQuery {
  private static instance: StatsQuery = new StatsQuery();

  public static getInstance(): StatsQuery {
    return StatsQuery.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Stats> {
    const response: AJAXResponse<StatsJSON> = await AJAX.get<StatsJSON>(`/api/stats/${statsID.get().get()}`);

    return statsFactory.fromJSON(response.body);
  }

  public async findByPage(page: number): Promise<Array<Stats>> {
    const response: AJAXResponse<Array<StatsJSON>> = await AJAX.get<Array<StatsJSON>>(`/api/stats/page/${page}`);

    return response.body.map<Stats>((json: StatsJSON) => {
      return statsFactory.fromJSON(json);
    });
  }
}
