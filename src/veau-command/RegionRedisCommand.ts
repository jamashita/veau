import { Region, RegionJSON } from '../veau-entity/Region';
import { CacheError } from '../veau-error/CacheError';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { IRegionCommand } from './interfaces/IRegionCommand';

export class RegionRedisCommand implements IRegionCommand {
  private static REDIS_KEY: string = 'Regions';
  private static DURATION: number = 10800;

  public static getInstance(): RegionRedisCommand {
    return new RegionRedisCommand();
  }

  private constructor() {
  }

  public async insertAll(regions: Array<Region>): Promise<any> {
    const regionJSONs: Array<RegionJSON> = regions.map<RegionJSON>((region: Region) => {
      return region.toJSON();
    });

    await VeauRedis.getString().set(RegionRedisCommand.REDIS_KEY, JSON.stringify(regionJSONs));

    return VeauRedis.expires(RegionRedisCommand.REDIS_KEY, RegionRedisCommand.DURATION);
  }

  public async deleteAll(): Promise<any> {
    const ok: boolean = await VeauRedis.delete(RegionRedisCommand.REDIS_KEY);
    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
