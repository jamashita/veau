import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError.js';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { ILocaleQuery } from '../ILocaleQuery.js';
import { IFetchQuery } from './IFetchQuery.js';

@injectable()
export class LocaleFetchQuery implements ILocaleQuery<FetchError>, IFetchQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly fetch: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) fetch: IFetch<'json'>) {
    this.fetch = fetch;
  }

  public all(): Superposition<Locale, FetchError | LocaleError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.fetch.get('/api/locale');
    }, FetchError).map<Locale, FetchError | LocaleError>(({ status, body }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (Locale.validate(body)) {
            return Locale.ofJSON(body);
          }

          throw new LocaleError('LocaleBinQuery.all()');
        }
        default: {
          throw new FetchError('GET LOCALE FAILED');
        }
      }
    }, LocaleError);
  }
}
