import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { ISO3166 } from '../veau-vo/ISO3166';
import { Region, RegionRow } from '../veau-vo/Region';
import { RegionID } from '../veau-vo/RegionID';
import { IRegionQuery } from './interfaces/IRegionQuery';

export class RegionMySQLQuery implements IRegionQuery {

  public static getInstance(): RegionMySQLQuery {
    return new RegionMySQLQuery();
  }

  private constructor() {
  }

  public async allRegions(): Promise<Array<Region>> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166`;

    const regions: Array<RegionRow> = await VeauMySQL.query(query);
    return regions.map<Region>((row: RegionRow) => {
      const {
        regionID,
        name,
        iso3166
      } = row;

      return Region.of(RegionID.of(regionID), name, ISO3166.of(iso3166));
    });
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
      throw new NoSuchElementError(iso3166.get());
    }

    return found;
  }
}
