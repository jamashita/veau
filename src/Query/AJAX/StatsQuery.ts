import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { Superposition } from '@jamashita/publikum-monad';
import { NO_CONTENT, OK } from 'http-status';
import { inject, injectable } from 'inversify';

import { Type } from '../../Container/Types';
import { StatsError } from '../../Entity/Stats/Error/StatsError';
import { Stats, StatsJSON } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsQuery } from '../Interface/IStatsQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class StatsQuery implements IStatsQuery<AJAXError>, IAJAXQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public findByStatsID(statsID: StatsID): Superposition<Stats, StatsError | NoSuchElementError | AJAXError> {
    return Superposition.playground<AJAXResponse<StatsJSON>, AJAXError>(() => {
      return this.ajax.get<StatsJSON>(`/api/stats/${statsID.get().get()}`);
    }, AJAXError).map<Stats, StatsError | NoSuchElementError | AJAXError>(
      ({status, body}: AJAXResponse<StatsJSON>) => {
        switch (status) {
          case OK: {
            return Stats.ofJSON(body);
          }
          case NO_CONTENT: {
            throw new NoSuchElementError('NOT FOUND');
          }
          default: {
            throw new AJAXError('UNKNOWN ERROR', status);
          }
        }
      },
      NoSuchElementError
    );
  }
}
