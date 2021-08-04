import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { ISessionCommand } from '../ISessionCommand.js';
import { IFetchCommand } from './IFetchCommand.js';

@injectable()
export class SessionFetchCommand implements ISessionCommand<FetchError>, IFetchCommand {
  public readonly noun: 'SessionCommand' = 'SessionCommand';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly fetch: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) fetch: IFetch<'json'>) {
    this.fetch = fetch;
  }

  public delete(): Superposition<unknown, FetchError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.fetch.delete('/api/session');
    }, FetchError).map<unknown, FetchError>((response: FetchResponse<'json'>) => {
      switch (response.status) {
        case StatusCodes.OK: {
          return null;
        }
        default: {
          throw new FetchError('UNKNOWN ERROR');
        }
      }
    });
  }
}
