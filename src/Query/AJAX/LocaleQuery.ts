import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { Superposition } from '@jamashita/publikum-monad';
import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery<AJAXError>, IAJAXQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX<'json'>;

  public constructor(@inject(Type.AJAX) ajax: IAJAX<'json'>) {
    this.ajax = ajax;
  }

  public all(): Superposition<Locale, LocaleError | AJAXError> {
    return Superposition.playground<AJAXResponse<'json'>, AJAXError>(() => {
      return this.ajax.get('/api/locale');
    }, AJAXError).map<Locale, LocaleError | AJAXError>(({ status, body }: AJAXResponse<'json'>) => {
      switch (status) {
        case OK: {
          if (Locale.validate(body)) {
            return Locale.ofJSON(body);
          }

          throw new LocaleError('LocaleQuery.all()');
        }
        default: {
          throw new AJAXError('GET LOCALE FAILED', status);
        }
      }
    }, LocaleError);
  }
}
