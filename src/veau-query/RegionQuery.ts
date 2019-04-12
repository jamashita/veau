import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../veau-vo/ISO3166';
import { Region, RegionRow } from '../veau-vo/Region';
import { RegionID } from '../veau-vo/RegionID';
import { IRegionQuery } from './interfaces/IRegionQuery';

const REDIS_KEY: string = 'Regions';

export class RegionQuery implements IRegionQuery {

  public static getInstance(): RegionQuery {
    return new RegionQuery();
  }

  private constructor() {
  }

  public async allRegions(): Promise<Array<Region>> {
    const regionString: string | null = await VeauRedis.getString().get(REDIS_KEY);

    if (regionString) {
      const regionRows: Array<RegionRow> = JSON.parse(regionString);
      return regionRows.map<Region>((row: RegionRow) => {
        return this.toRegion(row);
      });
    }

    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166`;

    const regions: Array<RegionRow> = await VeauMySQL.query(query);
    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(regions));
    return regions.map<Region>((row: RegionRow) => {
      return this.toRegion(row);
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

  private toRegion(row: RegionRow): Region {
    const {
      regionID,
      name,
      iso3166
    } = row;

    return Region.of(RegionID.of(regionID), name, ISO3166.of(iso3166));
  }
}
