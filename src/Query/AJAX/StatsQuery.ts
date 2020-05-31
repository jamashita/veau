import { NO_CONTENT, OK } from 'http-status';
import { inject, injectable } from 'inversify';

import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Dead, Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { StatsError } from '../../Entity/Stats/Error/StatsError';
import { Stats, StatsJSON } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsQuery } from '../Interface/IStatsQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class StatsQuery implements IStatsQuery, IAJAXQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async findByStatsID(
    statsID: StatsID
  ): Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    const response: AJAXResponse<StatsJSON> = await this.ajax.get<StatsJSON>(`/api/stats/${statsID.get().get()}`);
    // prettier-ignore
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Stats.ofJSON(body);
      }
      case NO_CONTENT: {
        return Dead.of<Stats, NoSuchElementError>(new NoSuchElementError('NOT FOUND'));
      }
      default: {
        return Dead.of<Stats, AJAXError>(new AJAXError('UNKNOWN ERROR', status));
      }
    }
  }
}
