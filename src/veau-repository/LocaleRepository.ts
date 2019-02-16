import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';
import { Region } from '../veau-vo/Region';
import { ILocaleRepository } from './interface/ILocaleRepository';

export class LocaleRepository implements ILocaleRepository {
  private languages: Array<Language>;
  private regions: Array<Region>;

  public static getInstance(languages: Array<Language>, regions: Array<Region>): LocaleRepository {
    return new LocaleRepository(languages, regions);
  }

  private constructor(languages: Array<Language>, regions: Array<Region>) {
    this.languages = languages;
    this.regions = regions;
  }

  public findByISO639(iso639: ISO639): Language {
    const languages: Array<Language> = this.languages.filter((language: Language) => {
      if (language.getISO639().equals(iso639)) {
        return true;
      }

      return false;
    });

    if (languages.length === 0) {
      throw new NoSuchElementError(iso639.toString());
    }

    return languages[0];
  }

  public findByISO3166(iso3166: ISO3166): Region {
    const regions: Array<Region> = this.regions.filter((region: Region) => {
      if (region.getISO3166().equals(iso3166)) {
        return true;
      }

      return false;
    });

    if (regions.length === 0) {
      throw new NoSuchElementError(iso3166.toString());
    }

    return regions[0];
  }

  public allLanguages(): Array<Language> {
    return this.languages;
  }

  public allRegions(): Array<Region> {
    return this.regions;
  }
}
