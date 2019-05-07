import { Language, LanguageJSON } from '@/veau-entity/Language';
import { Region, RegionJSON } from '@/veau-entity/Region';
import { NoSuchElementError } from '@/veau-error/NoSuchElementError';
import { LanguageFactory } from '@/veau-factory/LanguageFactory';
import { RegionFactory } from '@/veau-factory/RegionFactory';
import { AJAX, AJAXResponse } from '@/veau-general/AJAX';
import { Locales } from '@/veau-usecase/LocaleUseCase';
import { ISO3166 } from '@/veau-vo/ISO3166';
import { ISO639 } from '@/veau-vo/ISO639';
import { ILocaleQuery } from './interfaces/ILocaleQuery';

export class LocaleAJAXQuery implements ILocaleQuery {
  private locales: Locales | null;

  private static instance: LocaleAJAXQuery = new LocaleAJAXQuery();
  private static languageFactory: LanguageFactory = LanguageFactory.getInstance();
  private static regionFactory: RegionFactory = RegionFactory.getInstance();

  public static getInstance(): LocaleAJAXQuery {
    return LocaleAJAXQuery.instance;
  }

  private constructor() {
    this.locales = null;
  }

  public async findByISO639(iso639: ISO639): Promise<Language> {
    const languages: Array<Language> = await this.allLanguages();
    const found: Language | undefined = languages.find((language: Language) => {
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
    const regions: Array<Region> = await this.allRegions();
    const found: Region | undefined = regions.find((region: Region) => {
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

  private async allLocales(): Promise<Locales> {
    const {
      locales
    } = this;

    if (locales !== null) {
      return locales;
    }

    const response: AJAXResponse<Locales> = await AJAX.get<Locales>('/api/locales');
    this.locales = response.body;

    return response.body;
  }

  public async allLanguages(): Promise<Array<Language>> {
    const locales: Locales = await this.allLocales();

    return locales.languages.map<Language>((json: LanguageJSON) => {
      return LocaleAJAXQuery.languageFactory.fromJSON(json);
    });
  }

  public async allRegions(): Promise<Array<Region>> {
    const locales: Locales = await this.allLocales();

    return locales.regions.map<Region>((json: RegionJSON) => {
      return LocaleAJAXQuery.regionFactory.fromJSON(json);
    });
  }
}
