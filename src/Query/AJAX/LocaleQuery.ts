import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { AJAXError, AJAXResponse, DataSourceError, Dead, IAJAX, Superposition } from 'publikum';
import { Type } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale, LocaleJSON } from '../../VO/Locale/Locale';
import { IAJAXQuery } from './Interface/IAJAXQuery';
import { ILocaleQuery } from '../Interface/ILocaleQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IAJAXQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async all(): Promise<Superposition<Locale, LocaleError | DataSourceError>> {
    const response: AJAXResponse<LocaleJSON> = await this.ajax.get<LocaleJSON>('/api/locale');
    // prettier-ignore
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Locale.ofJSON(body);
      }
      default: {
        return Dead.of<Locale, AJAXError>(new AJAXError('GET LOCALE FAILED', status));
      }
    }
  }
}
