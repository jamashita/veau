import { Region, RegionJSON } from '../veau-entity/Region';
import { CacheError } from '../veau-error/CacheError';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { IRegionCommand } from './interfaces/IRegionCommand';

const REDIS_KEY: string = 'Regions';
const DURATION: number = 3 * 60 * 60;

export class RegionRedisCommand implements IRegionCommand {
  private static instance: RegionRedisCommand = new RegionRedisCommand();

  public static getInstance(): RegionRedisCommand {
    return RegionRedisCommand.instance;
  }

  private constructor() {
  }

  public async insertAll(regions: Array<Region>): Promise<any> {
    const regionJSONs: Array<RegionJSON> = regions.map<RegionJSON>((region: Region) => {
      return region.toJSON();
    });

    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(regionJSONs));

    return VeauRedis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<any> {
    const ok: boolean = await VeauRedis.delete(REDIS_KEY);

    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
