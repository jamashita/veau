import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IStatsCommand } from '../Interface/IStatsCommand';
import { IAJAXCommand } from './Interface/IAJAXCommand';

@injectable()
export class StatsCommand implements IStatsCommand<AJAXError>, IAJAXCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX<'json'>;

  public constructor(@inject(Type.AJAX) ajax: IAJAX<'json'>) {
    this.ajax = ajax;
  }

  public create(stats: Stats): Superposition<unknown, AJAXError> {
    return Superposition.playground<AJAXResponse<'json'>, AJAXError>(() => {
      return this.ajax.post('/api/stats', stats.toJSON());
    }, AJAXError).map<unknown, AJAXError>((response: AJAXResponse<'json'>) => {
      switch (response.status) {
        case StatusCodes.CREATED: {
          return null;
        }
        default: {
          throw new AJAXError('UNKNOWN ERROR', response.status);
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteByStatsID(_statsID: StatsID): Superposition<unknown, AJAXError> {
    throw new UnimplementedError();
  }
}
