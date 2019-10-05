import { Regions } from '../veau-entity/collection/Regions';
import { CacheError } from '../veau-error/CacheError';
import { veauRedis } from '../veau-infrastructure/VeauRedis';

const REDIS_KEY: string = 'REGIONS';
const DURATION: number = 3 * 60 * 60;

export class RegionCommand {
  private static instance: RegionCommand = new RegionCommand();

  public static getInstance(): RegionCommand {
    return RegionCommand.instance;
  }

  private constructor() {
  }

  public async insertAll(regions: Regions): Promise<unknown> {
    await veauRedis.getString().set(REDIS_KEY, JSON.stringify(regions.toJSON()));

    return veauRedis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<void> {
    const ok: boolean = await veauRedis.delete(REDIS_KEY);

    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
