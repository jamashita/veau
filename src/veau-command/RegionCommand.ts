import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { IRegionCommand } from './interfaces/IRegionCommand';

const REDIS_KEY: string = 'Regions';

export class RegionCommand implements IRegionCommand {

  public static getInstance(): RegionCommand {
    return new RegionCommand();
  }

  private constructor() {
  }

  public deleteAll(): Promise<boolean> {
    return VeauRedis.delete(REDIS_KEY);
  }
}
