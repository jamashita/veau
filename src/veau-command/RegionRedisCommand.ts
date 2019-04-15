import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { IRegionCommand } from './interfaces/IRegionCommand';

export class RegionRedisCommand implements IRegionCommand {
  private static REDIS_KEY: string = 'Regions';

  public static getInstance(): RegionRedisCommand {
    return new RegionRedisCommand();
  }

  private constructor() {
  }

  public deleteAll(): Promise<any> {
    return VeauRedis.delete(RegionRedisCommand.REDIS_KEY);
  }
}
