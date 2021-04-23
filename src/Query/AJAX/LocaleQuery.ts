import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IFetchQuery } from './Interface/IFetchQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery<FetchError>, IFetchQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly ajax: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) ajax: IFetch<'json'>) {
    this.ajax = ajax;
  }

  public all(): Superposition<Locale, LocaleError | FetchError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.ajax.get('/api/locale');
    }, FetchError).map<Locale, LocaleError | FetchError>(({ status, body }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (Locale.validate(body)) {
            return Locale.ofJSON(body);
          }

          throw new LocaleError('LocaleQuery.all()');
        }
        default: {
          throw new FetchError('GET LOCALE FAILED', status);
        }
      }
    }, LocaleError);
  }
}
