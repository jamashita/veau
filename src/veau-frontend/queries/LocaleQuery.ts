import { Language, LanguageJSON } from '../../veau-entity/Language';
import { Region, RegionJSON } from '../../veau-entity/Region';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { LanguageFactory } from '../../veau-factory/LanguageFactory';
import { RegionFactory } from '../../veau-factory/RegionFactory';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';

const languageFactory: LanguageFactory = LanguageFactory.getInstance();
const regionFactory: RegionFactory = RegionFactory.getInstance();

type Locales = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
};

export class LocaleQuery {
  private locales: Locales | null;

  private static instance: LocaleQuery = new LocaleQuery();

  public static getInstance(): LocaleQuery {
    return LocaleQuery.instance;
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
      return languageFactory.fromJSON(json);
    });
  }

  public async allRegions(): Promise<Array<Region>> {
    const locales: Locales = await this.allLocales();

    return locales.regions.map<Region>((json: RegionJSON) => {
      return regionFactory.fromJSON(json);
    });
  }
}
