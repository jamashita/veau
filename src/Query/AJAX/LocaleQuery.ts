import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import {
  AJAXError,
  AJAXResponse,
  Alive,
  DataSourceError,
  Dead,
  IAJAX,
  Superposition
} from 'publikum';
import { TYPE } from '../../Container/Types';
import { Locale, LocaleJSON } from '../../VO/Locale';
import { IAJAXQuery } from '../Interface/IAJAXQuery';
import { ILocaleQuery } from '../Interface/ILocaleQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IAJAXQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async all(): Promise<Superposition<Locale, DataSourceError>> {
    const response: AJAXResponse<LocaleJSON> = await this.ajax.get<LocaleJSON>('/api/locale');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Alive.of<Locale, DataSourceError>(Locale.ofJSON(body));
      }
      default: {
        return Dead.of<Locale, AJAXError>(new AJAXError('GET LOCALE FAILED', status));
      }
    }
  }
}
