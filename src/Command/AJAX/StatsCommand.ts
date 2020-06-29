import { CREATED } from 'http-status';
import { inject, injectable } from 'inversify';

import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IStatsCommand } from '../Interface/IStatsCommand';
import { IAJAXCommand } from './Interface/IAJAXCommand';

@injectable()
export class StatsCommand implements IStatsCommand<AJAXError>, IAJAXCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public create(stats: Stats): Superposition<unknown, AJAXError> {
    return Superposition.playground<AJAXResponse<unknown>, AJAXError>(() => {
      return this.ajax.post<unknown>('/api/stats', stats.toJSON());
    }).map<unknown, AJAXError>((response: AJAXResponse<unknown>) => {
      switch (response.status) {
        case CREATED: {
          return null;
        }
        default: {
          throw new AJAXError('UNKNOWN ERROR', response.status);
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteByStatsID(statsID: StatsID): Superposition<unknown, AJAXError> {
    throw new UnimplementedError();
  }
}
