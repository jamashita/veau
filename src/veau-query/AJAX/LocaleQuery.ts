import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { AJAXError } from '../../veau-general/AJAX/AJAXError';
import { AJAXResponse } from '../../veau-general/AJAX/AJAXResponse';
import { IAJAX } from '../../veau-general/AJAX/interfaces/IAJAX';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale, LocaleJSON } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { IAJAXQuery } from '../interfaces/IAJAXQuery';
import { ILocaleQuery } from '../interfaces/ILocaleQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IAJAXQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private ajax: IAJAX;
  private locale: Locale | null;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
    this.locale = null;
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    const trial: Try<Locale, DataSourceError> = await this.all();

    return trial.match<Try<Language, NoSuchElementError | DataSourceError>>((locale: Locale) => {
      const found: Language | undefined = locale.getLanguages().find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      if (found === undefined) {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      }

      return Success.of<Language, NoSuchElementError>(found);
    }, (err: DataSourceError) => {
      return Failure.of<Language, DataSourceError>(err);
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>> {
    const trial: Try<Locale, DataSourceError> = await this.all();

    return trial.match<Try<Region, NoSuchElementError | DataSourceError>>((locale: Locale) => {
      const found: Region | undefined = locale.getRegions().find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      if (found === undefined) {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      }

      return Success.of<Region, NoSuchElementError>(found);
    }, (err: DataSourceError) => {
      return Failure.of<Region, DataSourceError>(err);
    });
  }

  public async all(): Promise<Try<Locale, DataSourceError>> {
    const {
      locale
    } = this;

    if (locale !== null) {
      return Success.of<Locale, AJAXError>(locale);
    }

    const response: AJAXResponse<LocaleJSON> = await this.ajax.get<LocaleJSON>('/api/locale');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        this.locale = Locale.ofJSON(body);

        return Success.of<Locale, AJAXError>(this.locale);
      }
      default: {
        return Failure.of<Locale, AJAXError>(new AJAXError('GET LOCALE FAILED'));
      }
    }
  }
}
