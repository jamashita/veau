import { NoSuchElementError } from '../veau-general/NoSuchElementError';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../veau-vo/ISO3166';
import { Region, RegionRow } from '../veau-vo/Region';
import { RegionID } from '../veau-vo/RegionID';

const REDIS_KEY: string = 'Regions';

export class RegionRepository implements IRegionRepository {
  private static instance: RegionRepository = new RegionRepository();

  public static getInstance(): RegionRepository {
    return RegionRepository.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Array<Region>> {
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
      FROM regions R1;`;

    const regions: Array<RegionRow> = await VeauMySQL.query(query);
    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(regions));
    return regions.map<Region>((row: RegionRow) => {
      return this.toRegion(row);
    });
  }

  private toRegion(row: RegionRow): Region {
    const {
      regionID,
      name,
      iso3166
    } = row;

    return Region.of(RegionID.of(regionID), name, ISO3166.of(iso3166));
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Region> {
    const regions: Array<Region> = await this.all();
    const filtered: Array<Region> = regions.filter((locale: Region) => {
      if (locale.getISO3166().equals(iso3166)) {
        return true;
      }

      return false;
    });

    if (filtered.length === 0) {
      throw new NoSuchElementError(iso3166.get());
    }

    return filtered[0];
  }
}

export interface IRegionRepository {

  all(): Promise<Array<Region>>;

  findByISO3166(iso3166: ISO3166): Promise<Region>;
}
