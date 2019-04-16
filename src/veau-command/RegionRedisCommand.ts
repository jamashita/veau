import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { Region, RegionJSON } from '../veau-vo/Region';
import { IRegionCommand } from './interfaces/IRegionCommand';

export class RegionRedisCommand implements IRegionCommand {
  private static REDIS_KEY: string = 'Regions';

  public static getInstance(): RegionRedisCommand {
    return new RegionRedisCommand();
  }

  private constructor() {
  }

  public insertAll(regions: Array<Region>): Promise<any> {
    const regionJSONs: Array<RegionJSON> = regions.map<RegionJSON>((region: Region) => {
      return region.toJSON();
    });

    return VeauRedis.getString().set(RegionRedisCommand.REDIS_KEY, JSON.stringify(regionJSONs));
  }

  public deleteAll(): Promise<any> {
    return VeauRedis.delete(RegionRedisCommand.REDIS_KEY);
  }
}
