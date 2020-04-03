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

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError>> {
    const locale: Locale = await this.all();
    const found: Language | undefined = locale.getLanguages().find((language: Language) => {
      return language.getISO639().equals(iso639);
    });

    if (found === undefined) {
      return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
    }

    return Success.of<Language, NoSuchElementError>(found);
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError>> {
    const locale: Locale = await this.all();
    const found: Region | undefined = locale.getRegions().find((region: Region) => {
      return region.getISO3166().equals(iso3166);
    });

    if (found === undefined) {
      return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
    }

    return Success.of<Region, NoSuchElementError>(found);
  }

  public async all(): Promise<Locale> {
    const {
      locale
    } = this;

    if (locale !== null) {
      return locale;
    }

    const response: AJAXResponse<LocaleJSON> = await AJAX.get<LocaleJSON>('/api/locale');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        this.locale = Locale.ofJSON(body);

        return this.locale;
      }
      default: {
        throw new AJAXError('GET LOCALE FAILED');
      }
    }
  }
}
