import { NOT_FOUND, OK } from 'http-status';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { AJAXError } from '../../veau-error/AJAXError';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { StatsError } from '../../veau-error/StatsError';
import { StatsOutlinesError } from '../../veau-error/StatsOutlinesError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { Page } from '../../veau-vo/Page';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsOutlineJSON } from '../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';

export class StatsQuery {

  public async findByStatsID(statsID: StatsID): Promise<Try<Stats, StatsError | NotFoundError | AJAXError>> {
    const response: AJAXResponse<StatsJSON> = await AJAX.get<StatsJSON>(`/api/stats/${statsID.get()}`);
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Stats.ofJSON(body);
      }
      case NOT_FOUND: {
        return Failure.of<Stats, NotFoundError>(new NotFoundError());
      }
      default: {
        return Failure.of<Stats, NotFoundError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }

  public async findByPage(page: Page): Promise<Try<StatsOutlines, StatsOutlinesError | AJAXError>> {
    const response: AJAXResponse<Array<StatsOutlineJSON>> = await AJAX.get<Array<StatsOutlineJSON>>(`/api/stats/page/${page.get().toString()}`);
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return StatsOutlines.ofJSON(body);
      }
      default: {
        return Failure.of<StatsOutlines, AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }
}
