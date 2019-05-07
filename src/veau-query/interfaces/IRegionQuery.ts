import { Region } from '@/veau-entity/Region';
import { ISO3166 } from '@/veau-vo/ISO3166';

export interface IRegionQuery {

  allRegions(): Promise<Array<Region>>;

  findByISO3166(iso3166: ISO3166): Promise<Region>;
}
