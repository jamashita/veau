import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { AJAXError } from '../../veau-general/AJAX/AJAXError';
import { AJAXResponse } from '../../veau-general/AJAX/AJAXResponse';
import { IAJAX } from '../../veau-general/AJAX/interfaces/IAJAX';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Locale, LocaleJSON } from '../../veau-vo/Locale';
import { IAJAXQuery } from '../Interfaces/IAJAXQuery';
import { ILocaleQuery } from '../Interfaces/ILocaleQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IAJAXQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async all(): Promise<Try<Locale, DataSourceError>> {
    const response: AJAXResponse<LocaleJSON> = await this.ajax.get<LocaleJSON>('/api/locale');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Success.of<Locale, DataSourceError>(Locale.ofJSON(body));
      }
      default: {
        return Failure.of<Locale, AJAXError>(new AJAXError('GET LOCALE FAILED'));
      }
    }
  }
}
