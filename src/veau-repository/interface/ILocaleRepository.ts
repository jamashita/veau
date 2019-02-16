import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';
import { Region } from '../veau-vo/Region';

export interface ILocaleRepository {

  findByISO639(iso639: ISO639): Language;

  findByISO3166(iso3166: ISO3166): Region;

  allLanguages(): Array<Language>;

  allRegions(): Array<Region>;
}
