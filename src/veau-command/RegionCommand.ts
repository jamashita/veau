import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { CacheError } from '../veau-error/CacheError';
import { Redis } from '../veau-general/Redis/Redis';
import { Regions } from '../veau-vo/Regions';

const REDIS_KEY: string = 'REGIONS';
const DURATION: number = 3 * 60 * 60;

@injectable()
export class RegionCommand {
  private redis: Redis;

  public constructor(
    @inject(TYPE.Redis) redis: Redis
  ) {
    this.redis = redis;
  }

  public async insertAll(regions: Regions): Promise<unknown> {
    await this.redis.getString().set(REDIS_KEY, JSON.stringify(regions.toJSON()));

    return this.redis.expires(REDIS_KEY, DURATION);
  }

  public async deleteAll(): Promise<void> {
    const ok: boolean = await this.redis.delete(REDIS_KEY);

    if (ok) {
      return;
    }

    throw new CacheError('FAIL TO DELETE CACHE');
  }
}
