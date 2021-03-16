import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { Superposition } from '@jamashita/publikum-monad';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { ISessionCommand } from '../Interface/ISessionCommand';
import { IAJAXCommand } from './Interface/IAJAXCommand';

@injectable()
export class SessionCommand implements ISessionCommand<AJAXError>, IAJAXCommand {
  public readonly noun: 'SessionCommand' = 'SessionCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX<'json'>;

  public constructor(@inject(Type.AJAX) ajax: IAJAX<'json'>) {
    this.ajax = ajax;
  }

  public delete(): Superposition<unknown, AJAXError> {
    return Superposition.playground<AJAXResponse<'json'>, AJAXError>(() => {
      return this.ajax.delete('/api/session');
    }, AJAXError).map<unknown, AJAXError>((response: AJAXResponse<'json'>) => {
      switch (response.status) {
        case StatusCodes.OK: {
          return null;
        }
        default: {
          throw new AJAXError('UNKNOWN ERROR', response.status);
        }
      }
    });
  }
}
