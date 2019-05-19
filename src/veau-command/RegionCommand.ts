import { Region, RegionJSON } from '../veau-entity/Region';
import { CacheError } from '../veau-error/CacheError';
import { veauRedis } from '../veau-infrastructure/VeauRedis';

const REDIS_KEY: string = 'Regions';
const DURATION: number = 3 * 60 * 60;

export class RegionCommand {
  private static instance: RegionCommand = new RegionCommand();

  public static getInstance(): RegionCommand {
    return RegionCommand.instance;
  }

  private constructor() {
  }

  public async insertAll(regions: Array<Region>): Promise<any> {
    const regionJSONs: Array<RegionJSON> = regions.map<RegionJSON>((region: Region) => {
      return region.toJSON();
    });

    await veauRedis.getString().set(REDIS_KEY, JSON.stringify(regionJSONs));

    return veauRedis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<any> {
    const ok: boolean = await veauRedis.delete(REDIS_KEY);

    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
