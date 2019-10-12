import { NOT_FOUND, OK } from 'http-status';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { AJAXError } from '../../veau-error/AJAXError';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsOutlineJSON } from '../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';

export class StatsQuery {
  private static instance: StatsQuery = new StatsQuery();

  public static getInstance(): StatsQuery {
    return StatsQuery.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Stats> {
    const response: AJAXResponse<StatsJSON> = await AJAX.get<StatsJSON>(`/api/stats/${statsID.get()}`);
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Stats.fromJSON(body);
      }
      case NOT_FOUND: {
        throw new NotFoundError();
      }
      default: {
        throw new AJAXError('UNKNOWN ERROR');
      }
    }
  }

  public async findByPage(page: number): Promise<StatsOutlines> {
    const response: AJAXResponse<Array<StatsOutlineJSON>> = await AJAX.get<Array<StatsOutlineJSON>>(`/api/stats/page/${page}`);
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return StatsOutlines.ofJSON(body);
      }
      default: {
        throw new AJAXError('UNKNOWN ERROR');
      }
    }
  }
}
