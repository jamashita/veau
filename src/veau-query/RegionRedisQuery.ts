import { Region, RegionRow } from '../veau-entity/Region';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { RegionFactory } from '../veau-factory/RegionFactory';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../veau-vo/ISO3166';
import { IRegionQuery } from './interfaces/IRegionQuery';

export class RegionRedisQuery implements IRegionQuery {
  private static instance: RegionRedisQuery = new RegionRedisQuery();
  private static regionFactory: RegionFactory = RegionFactory.getInstance();
  private static REGIONS_REDIS_KEY: string = 'REGIONS';

  public static getInstance(): RegionRedisQuery {
    return RegionRedisQuery.instance;
  }

  private constructor() {
  }

  public async allRegions(): Promise<Array<Region>> {
    const regionString: string | null = await VeauRedis.getString().get(RegionRedisQuery.REGIONS_REDIS_KEY);

    if (regionString) {
      const regionRows: Array<RegionRow> = JSON.parse(regionString);
      return regionRows.map<Region>((row: RegionRow) => {
        return RegionRedisQuery.regionFactory.fromRow(row);
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
