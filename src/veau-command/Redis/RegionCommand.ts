import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { JSONA } from '../../veau-general/JSONA';
import { IRedis } from '../../veau-general/Redis/interfaces/IRedis';
import { RedisError } from '../../veau-general/Redis/RedisError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Regions } from '../../veau-vo/Regions';
import { IRedisCommand } from '../interfaces/IRedisCommand';
import { IRegionCommand } from '../interfaces/IRegionCommand';

const REDIS_KEY: string = 'REGIONS';
const DURATION: number = 3 * 60 * 60;

@injectable()
export class RegionCommand implements IRegionCommand, IRedisCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(TYPE.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async insertAll(regions: Regions): Promise<Try<void, RedisError>> {
    try {
      const str: string = await JSONA.stringify(regions.toJSON());
      await this.redis.getString().set(REDIS_KEY, str);
      await this.redis.expires(REDIS_KEY, DURATION);

      return Success.of<void, RedisError>(undefined);
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<void, RedisError>(err);
      }

      throw err;
    }
  }

  public async deleteAll(): Promise<Try<void, CacheError | RedisError>> {
    try {
      const ok: boolean = await this.redis.delete(REDIS_KEY);

      if (ok) {
        return Success.of<void, CacheError>(undefined);
      }

      return Failure.of<void, CacheError>(new CacheError('FAIL TO DELETE CACHE'));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<void, RedisError>(err);
      }

      throw err;
    }
  }
}
