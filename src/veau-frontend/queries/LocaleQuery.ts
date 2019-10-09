import { OK } from 'http-status';
import { Locale, LocaleJSON } from '../../veau-entity/aggregate/Locale';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { AJAXError } from '../../veau-error/AJAXError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';

export class LocaleQuery {
  private locale: Locale | null;

  private static instance: LocaleQuery = new LocaleQuery();

  public static getInstance(): LocaleQuery {
    return LocaleQuery.instance;
  }

  private constructor() {
    this.locale = null;
  }

  public async findByISO639(iso639: ISO639): Promise<Language> {
    const locale: Locale = await this.all();
    const found: Language | undefined = locale.getLanguages().find((language: Language): boolean => {
      if (language.getISO639().equals(iso639)) {
        return true;
      }

      return false;
    });

    if (found === undefined) {
      throw new NoSuchElementError(iso639.toString());
    }

    return found;
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Region> {
    const locale: Locale = await this.all();
    const found: Region | undefined = locale.getRegions().find((region: Region): boolean => {
      if (region.getISO3166().equals(iso3166)) {
        return true;
      }

      return false;
    });

    if (found === undefined) {
      throw new NoSuchElementError(iso3166.toString());
    }

    return found;
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
        this.locale = Locale.fromJSON(body);

        return this.locale;
      }
      default: {
        throw new AJAXError('GET LOCALE FAILED');
      }
    }
  }
}
