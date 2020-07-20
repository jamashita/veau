import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { Superposition } from '@jamashita/publikum-monad';
import { OK } from 'http-status';
import { inject, injectable } from 'inversify';

import { Type } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale, LocaleJSON } from '../../VO/Locale/Locale';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery<AJAXError>, IAJAXQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public all(): Superposition<Locale, LocaleError | AJAXError> {
    return Superposition.playground<AJAXResponse<LocaleJSON>, AJAXError>(() => {
      return this.ajax.get<LocaleJSON>('/api/locale');
    }, AJAXError).map<Locale, LocaleError | AJAXError>(({status, body}: AJAXResponse<LocaleJSON>) => {
      switch (status) {
        case OK: {
          return Locale.ofJSON(body);
        }
        default: {
          throw new AJAXError('GET LOCALE FAILED', status);
        }
      }
    });
  }
}
