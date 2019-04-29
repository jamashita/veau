import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../veau-vo/ISO3166';
import { Region, RegionRow } from '../veau-vo/Region';
import { RegionID } from '../veau-vo/RegionID';
import { IRegionQuery } from './interfaces/IRegionQuery';

export class RegionRedisQuery implements IRegionQuery {
  private static REGIONS_REDIS_KEY: string = 'REGIONS';

  public static getInstance(): RegionRedisQuery {
    return new RegionRedisQuery();
  }

  private constructor() {
  }

  public async allRegions(): Promise<Array<Region>> {
    const regionString: string | null = await VeauRedis.getString().get(RegionRedisQuery.REGIONS_REDIS_KEY);

    if (regionString) {
      const regionRows: Array<RegionRow> = JSON.parse(regionString);
      return regionRows.map<Region>((row: RegionRow) => {
        const {
          regionID,
          name,
          iso3166
        } = row;

        return Region.of(RegionID.of(regionID), name, ISO3166.of(iso3166));
      });
    }

    return [];
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
}
