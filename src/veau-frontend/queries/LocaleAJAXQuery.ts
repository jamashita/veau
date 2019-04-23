import { NoSuchElementError } from '../../veau-general/Error/NoSuchElementError';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import { ILocaleQuery } from './interfaces/ILocaleQuery';

export class LocaleAJAXQuery implements ILocaleQuery {
  private languages: Array<Language>;
  private regions: Array<Region>;

  public static getInstance(languages: Array<Language>, regions: Array<Region>): LocaleAJAXQuery {
    return new LocaleAJAXQuery(languages, regions);
  }

  private constructor(languages: Array<Language>, regions: Array<Region>) {
    this.languages = languages;
    this.regions = regions;
  }

  public findByISO639(iso639: ISO639): Language {
    const found: Language | undefined = this.languages.find((language: Language) => {
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

  public findByISO3166(iso3166: ISO3166): Region {
    const found: Region | undefined = this.regions.find((region: Region) => {
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

  public allLanguages(): Array<Language> {
    return this.languages;
  }

  public allRegions(): Array<Region> {
    return this.regions;
  }
}
