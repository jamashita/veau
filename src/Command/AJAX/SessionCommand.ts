import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { ISessionCommand } from '../Interface/ISessionCommand';
import { IFetchCommand } from './Interface/IFetchCommand';

@injectable()
export class SessionCommand implements ISessionCommand<FetchError>, IFetchCommand {
  public readonly noun: 'SessionCommand' = 'SessionCommand';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly ajax: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) ajax: IFetch<'json'>) {
    this.ajax = ajax;
  }

  public delete(): Superposition<unknown, FetchError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.ajax.delete('/api/session');
    }, FetchError).map<unknown, FetchError>((response: FetchResponse<'json'>) => {
      switch (response.status) {
        case StatusCodes.OK: {
          return null;
        }
        default: {
          throw new FetchError('UNKNOWN ERROR', response.status);
        }
      }
    });
  }
}
