import { OK } from 'http-status';
import { AJAXError } from '../../veau-error/AJAXError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale, LocaleJSON } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';

export class LocaleQuery {
  private locale: Locale | null;

  private static instance: LocaleQuery = new LocaleQuery();

  public static getInstance(): LocaleQuery {
    return LocaleQuery.instance;
  }

  private constructor() {
    this.locale = null;
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | AJAXError>> {
    const trial: Try<Locale, AJAXError> = await this.all();
    return trial.complete<Language, NoSuchElementError | AJAXError>((locale: Locale) => {
      const found: Language | undefined = locale.getLanguages().find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      if (found === undefined) {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      }

      return Success.of<Language, NoSuchElementError>(found);
    }, (err: AJAXError) => {
      return Failure.of<Language, AJAXError>(err);
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | AJAXError>> {
    const trial: Try<Locale, AJAXError> = await this.all();
    return trial.complete<Region, NoSuchElementError | AJAXError>((locale: Locale) => {
      const found: Region | undefined = locale.getRegions().find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      if (found === undefined) {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      }

      return Success.of<Region, NoSuchElementError>(found);
    }, (err: AJAXError) => {
      return Failure.of<Region, AJAXError>(err);
    });
  }

  public async all(): Promise<Try<Locale, AJAXError>> {
    const {
      locale
    } = this;

    if (locale !== null) {
      return Success.of<Locale, AJAXError>(locale);
    }

    const response: AJAXResponse<LocaleJSON> = await AJAX.get<LocaleJSON>('/api/locale');
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
