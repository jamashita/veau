import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { StatsOutline, StatsOutlineJSON } from '../../veau-entity/StatsOutline';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { StatsOutlineFactory } from '../../veau-factory/StatsOutlineFactory';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { StatsID } from '../../veau-vo/StatsID';

const statsFactory: StatsFactory = StatsFactory.getInstance();
const statsOutlineFactory: StatsOutlineFactory = StatsOutlineFactory.getInstance();

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

  public async findByPage(page: number): Promise<Array<StatsOutline>> {
    const response: AJAXResponse<Array<StatsOutlineJSON>> = await AJAX.get<Array<StatsOutlineJSON>>(`/api/stats/page/${page}`);

    return response.body.map<StatsOutline>((json: StatsOutlineJSON) => {
      return statsOutlineFactory.fromJSON(json);
    });
  }
}
