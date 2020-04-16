import { CREATED } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats';
import { AJAXError } from '../../General/AJAX/AJAXError';
import { AJAXResponse } from '../../General/AJAX/AJAXResponse';
import { IAJAX } from '../../General/AJAX/Interface/IAJAX';
import { DataSourceError } from '../../General/DataSourceError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Superposition } from '../../General/Superposition/Superposition';
import { UnimplementedError } from '../../General/UnimplementedError';
import { IAJAXCommand } from '../Interface/IAJAXCommand';
import { IStatsCommand } from '../Interface/IStatsCommand';

@injectable()
export class StatsCommand implements IStatsCommand, IAJAXCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async create(stats: Stats): Promise<Superposition<void, DataSourceError>> {
    const response: AJAXResponse<unknown> = await this.ajax.post<unknown>('/api/stats', stats.toJSON());

    switch (response.status) {
      case CREATED: {
        return Success.of<DataSourceError>();
      }
      default: {
        return Failure.of<AJAXError>(new AJAXError('UNKNOWN ERROR', response.status));
      }
    }
  }

  public deleteByStatsID(): Promise<Superposition<void, DataSourceError>> {
    return Promise.reject<Superposition<void, DataSourceError>>(new UnimplementedError());
  }
}
