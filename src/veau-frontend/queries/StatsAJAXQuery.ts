import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { StatsFactory } from '../../veau-factory/StatsFactory';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { StatsID } from '../../veau-vo/StatsID';
import { IStatsQuery } from './interfaces/IStatsQuery';

export class StatsAJAXQuery implements IStatsQuery {
  private static instance: StatsAJAXQuery = new StatsAJAXQuery();
  private static statsFactory: StatsFactory = StatsFactory.getInstance();

  public static getInstance(): StatsAJAXQuery {
    return StatsAJAXQuery.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Stats> {
    const json: AJAXResponse<StatsJSON> = await AJAX.get(`/api/stats/${statsID.get().get()}`);

    return StatsAJAXQuery.statsFactory.fromJSON(json);
  }
}
