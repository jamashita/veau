import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region } from '../../veau-vo/Region';

export interface IRegionQuery {

  allRegions(): Promise<Array<Region>>;

  findByISO3166(iso3166: ISO3166): Promise<Region>;
}
