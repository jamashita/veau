import { RegionCommand } from '../veau-command/RegionCommand';
import { Region, RegionJSON, RegionRow } from '../veau-entity/Region';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { RegionFactory } from '../veau-factory/RegionFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../veau-vo/ISO3166';

const regionFactory: RegionFactory = RegionFactory.getInstance();
const regionCommand: RegionCommand = RegionCommand.getInstance();

const REDIS_KEY: string = 'REGIONS';

export class RegionQuery {
  private static instance: RegionQuery = new RegionQuery();

  public static getInstance(): RegionQuery {
    return RegionQuery.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Array<Region>> {
    const regionString: string | null = await VeauRedis.getString().get(REDIS_KEY);

    if (regionString !== null) {
      const regionJSONs: Array<RegionJSON> = JSON.parse(regionString);
      return regionJSONs.map<Region>((json: RegionJSON) => {
        return regionFactory.fromJSON(json);
      });
    }

    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166`;

    const regionRows: Array<RegionRow> = await VeauMySQL.execute(query);
    const regions: Array<Region> = regionRows.map<Region>((row: RegionRow) => {
      return regionFactory.fromRow(row);
    });

    await regionCommand.insertAll(regions);

    return regions;
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Region> {
    const regions: Array<Region> = await this.all();
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
