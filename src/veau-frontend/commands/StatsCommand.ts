import { CREATED } from 'http-status';
import { Stats } from '../../veau-entity/Stats';
import { AJAXError } from '../../veau-error/AJAXError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';

export class StatsCommand {

  public async create(stats: Stats): Promise<Try<void, AJAXError>> {
    const response: AJAXResponse<unknown> = await AJAX.post<unknown>('/api/stats', stats.toJSON());

    switch (response.status) {
      case CREATED: {
        return Success.of<void, AJAXError>(undefined);
      }
      default: {
        return Failure.of<void, AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }
}
