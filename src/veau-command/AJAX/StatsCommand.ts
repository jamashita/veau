import { CREATED } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { Stats } from '../../veau-entity/Stats';
import { AJAXError } from '../../veau-error/AJAXError';
import { AJAXRequestable } from '../../veau-general/AJAX/AJAXRequestable';
import { AJAXResponse } from '../../veau-general/AJAX/AJAXResponse';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { IAJAXCommand } from '../interfaces/IAJAXCommand';
import { IStatsCommand } from '../interfaces/IStatsCommand';

@injectable()
export class StatsCommand implements IStatsCommand, IAJAXCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private ajax: AJAXRequestable;

  public constructor(@inject(TYPE.AJAX) ajax: AJAXRequestable) {
    this.ajax = ajax;
  }

  public async create(stats: Stats): Promise<Try<void, AJAXError>> {
    const response: AJAXResponse<unknown> = await this.ajax.post<unknown>('/api/stats', stats.toJSON());

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
