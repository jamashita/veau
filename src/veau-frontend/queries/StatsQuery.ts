import { NOT_FOUND, OK } from 'http-status';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { AJAXError } from '../../veau-error/AJAXError';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Page } from '../../veau-vo/Page';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsOutlineJSON } from '../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';

export class StatsQuery {

  public async findByStatsID(statsID: StatsID): Promise<Try<Stats, NotFoundError | AJAXError>> {
    const response: AJAXResponse<StatsJSON> = await AJAX.get<StatsJSON>(`/api/stats/${statsID.get()}`);
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Success.of<Stats, NotFoundError | AJAXError>(Stats.ofJSON(body));
      }
      case NOT_FOUND: {
        return Failure.of<Stats, NotFoundError | AJAXError>(new NotFoundError());
      }
      default: {
        return Failure.of<Stats, NotFoundError | AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }

  public async findByPage(page: Page): Promise<Try<StatsOutlines, AJAXError>> {
    const response: AJAXResponse<Array<StatsOutlineJSON>> = await AJAX.get<Array<StatsOutlineJSON>>(`/api/stats/page/${page.get().toString()}`);
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Success.of<StatsOutlines, AJAXError>(StatsOutlines.ofJSON(body));
      }
      default: {
        return Failure.of<StatsOutlines, AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }
}
