import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { AJAXResponse, Alive, DataSourceError, Dead, IAJAX, Superposition } from 'publikum';
import { AJAXError } from 'publikum/AJAX';
import { TYPE } from '../../Container/Types';
import { IAJAXCommand } from '../Interface/IAJAXCommand';
import { ISessionCommand } from '../Interface/ISessionCommand';

@injectable()
export class SessionCommand implements ISessionCommand, IAJAXCommand {
  public readonly noun: 'SessionCommand' = 'SessionCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async delete(): Promise<Superposition<void, DataSourceError>> {
    const response: AJAXResponse<unknown> = await this.ajax.delete<unknown>('/api/destroy');

    switch (response.status) {
      case OK: {
        return Alive.of<DataSourceError>();
      }
      default: {
        return Dead.of<AJAXError>(new AJAXError('UNKNOWN ERROR', response.status));
      }
    }
  }
}
