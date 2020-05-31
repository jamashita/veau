import { CREATED } from 'http-status';
import { inject, injectable } from 'inversify';

import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IStatsCommand } from '../Interface/IStatsCommand';
import { IAJAXCommand } from './Interface/IAJAXCommand';

@injectable()
export class StatsCommand implements IStatsCommand, IAJAXCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async create(stats: Stats): Promise<Superposition<unknown, DataSourceError>> {
    const response: AJAXResponse<unknown> = await this.ajax.post<unknown>('/api/stats', stats.toJSON());

    switch (response.status) {
      case CREATED: {
        return Alive.of<DataSourceError>();
      }
      default: {
        return Dead.of<AJAXError>(new AJAXError('UNKNOWN ERROR', response.status));
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteByStatsID(statsID: StatsID): Promise<Superposition<unknown, DataSourceError>> {
    return Promise.reject<Superposition<unknown, DataSourceError>>(new UnimplementedError());
  }
}
