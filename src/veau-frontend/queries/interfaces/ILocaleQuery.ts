import { Language } from '@/veau-entity/Language';
import { Region } from '@/veau-entity/Region';
import { ISO3166 } from '@/veau-vo/ISO3166';
import { ISO639 } from '@/veau-vo/ISO639';

export interface ILocaleQuery {

  findByISO639(iso639: ISO639): Promise<Language>;

  findByISO3166(iso3166: ISO3166): Promise<Region>;

  allLanguages(): Promise<Array<Language>>;

  allRegions(): Promise<Array<Region>>;
}
