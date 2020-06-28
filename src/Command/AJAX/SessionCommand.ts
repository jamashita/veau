import { OK } from 'http-status';
import { inject, injectable } from 'inversify';

import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { Superposition } from '@jamashita/publikum-monad';

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

  public delete(): Superposition<unknown, AJAXError> {
    return Superposition.playground<AJAXResponse<unknown>, AJAXError>(() => {
      return this.ajax.delete<unknown>('/api/destroy');
    }).map<unknown, AJAXError>((response: AJAXResponse<unknown>) => {
      switch (response.status) {
        case OK: {
          return null;
        }
        default: {
          throw new AJAXError('UNKNOWN ERROR', response.status);
        }
      }
    });
  }
}
