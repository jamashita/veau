import { Locale, LocaleJSON } from '../../veau-entity/aggregate/Locale';
import { Languages } from '../../veau-entity/collection/Languages';
import { Regions } from '../../veau-entity/collection/Regions';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
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
    const languages: Languages = await this.allLanguages();
    const found: Language | undefined = languages.find((language: Language): boolean => {
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
    const regions: Regions = await this.allRegions();
    const found: Region | undefined = regions.find((region: Region): boolean => {
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
    this.locale = Locale.fromJSON(response.body);

    return this.locale;
  }

  public async allLanguages(): Promise<Languages> {
    const locale: Locale = await this.all();

    return locale.getLanguages();
  }

  public async allRegions(): Promise<Regions> {
    const locale: Locale = await this.all();

    return locale.getRegions();
  }
}
