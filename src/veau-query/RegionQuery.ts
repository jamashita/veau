import { inject, injectable } from 'inversify';
import { RegionCommand } from '../veau-command/RegionCommand';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { JSONA } from '../veau-general/JSONA';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { Redis } from '../veau-general/Redis/Redis';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ISO3166 } from '../veau-vo/ISO3166';
import { Region, RegionJSON, RegionRow } from '../veau-vo/Region';
import { Regions } from '../veau-vo/Regions';

const REDIS_KEY: string = 'REGIONS';

@injectable()
export class RegionQuery {
  private mysql: MySQL;
  private redis: Redis;
  private regionCommand: RegionCommand;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL,
    @inject(TYPE.Redis) redis: Redis,
    @inject(TYPE.RegionCommand) regionCommand: RegionCommand
  ) {
    this.mysql = mysql;
    this.redis = redis;
    this.regionCommand = regionCommand;
  }

  public async all(): Promise<Regions> {
    const regionString: string | null = await this.redis.getString().get(REDIS_KEY);

    if (regionString !== null) {
      const regionJSONs: Array<RegionJSON> = await JSONA.parse<Array<RegionJSON>>(regionString);
      return Regions.ofJSON(regionJSONs);
    }

    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`;

    const regionRows: Array<RegionRow> = await this.mysql.execute<Array<RegionRow>>(query);
    const regions: Regions = Regions.ofRow(regionRows);

    await this.regionCommand.insertAll(regions);

    return regions;
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError>> {
    const regions: Regions = await this.all();
    const found: Region | undefined = regions.find((region: Region) => {
      return region.getISO3166().equals(iso3166);
    });

    if (found === undefined) {
      return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
    }

    return Success.of<Region, NoSuchElementError>(found);
  }
}
