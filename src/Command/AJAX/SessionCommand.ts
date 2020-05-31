import { OK } from 'http-status';
import { inject, injectable } from 'inversify';

import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { ISessionCommand } from '../Interface/ISessionCommand';
import { IAJAXCommand } from './Interface/IAJAXCommand';

@injectable()
export class SessionCommand implements ISessionCommand, IAJAXCommand {
  public readonly noun: 'SessionCommand' = 'SessionCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async delete(): Promise<Superposition<unknown, DataSourceError>> {
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
