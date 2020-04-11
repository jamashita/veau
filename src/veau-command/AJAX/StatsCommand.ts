import { CREATED } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { Stats } from '../../veau-entity/Stats';
import { AJAXError } from '../../veau-general/AJAX/AJAXError';
import { AJAXResponse } from '../../veau-general/AJAX/AJAXResponse';
import { IAJAX } from '../../veau-general/AJAX/interfaces/IAJAX';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { StatsID } from '../../veau-vo/StatsID';
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

  public async create(stats: Stats): Promise<Try<void, DataSourceError>> {
    const response: AJAXResponse<unknown> = await this.ajax.post<unknown>('/api/stats', stats.toJSON());

    switch (response.status) {
      case CREATED: {
        return Success.of<DataSourceError>();
      }
      default: {
        return Failure.of<AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteByStatsID(statsID: StatsID): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}
