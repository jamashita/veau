import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { Superposition } from '@jamashita/publikum-monad';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsError } from '../../VO/StatsOutline/Error/StatsError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsQuery } from '../Interface/IStatsQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class StatsQuery implements IStatsQuery<AJAXError>, IAJAXQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX<'json'>;

  public constructor(@inject(Type.AJAX) ajax: IAJAX<'json'>) {
    this.ajax = ajax;
  }

  public findByStatsID(statsID: StatsID): Superposition<Stats, StatsError | NoSuchElementError | AJAXError> {
    return Superposition.playground<AJAXResponse<'json'>, AJAXError>(() => {
      return this.ajax.get(`/api/stats/${statsID.get().get()}`);
    }, AJAXError).map<Stats, StatsError | NoSuchElementError | AJAXError>(({ status, body }: AJAXResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (Stats.validate(body)) {
            return Stats.ofJSON(body);
          }

          throw new StatsError('StatsQuery.findByStatsID()');
        }
        case StatusCodes.NO_CONTENT: {
          throw new NoSuchElementError('NOT FOUND');
        }
        default: {
          throw new AJAXError('UNKNOWN ERROR', status);
        }
      }
    }, StatsError, NoSuchElementError);
  }
}
