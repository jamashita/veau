import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { IRegionCommand } from './interfaces/IRegionCommand';

const REDIS_KEY: string = 'Regions';

export class RegionRedisCommand implements IRegionCommand {

  public static getInstance(): RegionRedisCommand {
    return new RegionRedisCommand();
  }

  private constructor() {
  }

  public deleteAll(): Promise<any> {
    return VeauRedis.delete(REDIS_KEY);
  }
}
