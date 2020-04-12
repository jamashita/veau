import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { JSONA } from '../../veau-general/JSONA';
import { IRedis } from '../../veau-general/Redis/Interface/IRedis';
import { RedisError } from '../../veau-general/Redis/RedisError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { REDIS_REGION_KEY } from '../../veau-infrastructure/VeauRedis';
import { Regions } from '../../veau-vo/Regions';
import { IRedisCommand } from '../Interface/IRedisCommand';
import { IRegionCommand } from '../Interface/IRegionCommand';

const DURATION: number = 3 * 60 * 60;

@injectable()
export class RegionCommand implements IRegionCommand, IRedisCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(TYPE.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async insertAll(regions: Regions): Promise<Try<void, DataSourceError>> {
    try {
      const str: string = await JSONA.stringify(regions.toJSON());
      await this.redis.getString().set(REDIS_REGION_KEY, str);
      await this.redis.expires(REDIS_REGION_KEY, DURATION);

      return Success.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<RedisError>(err);
      }

      throw err;
    }
  }

  public async deleteAll(): Promise<Try<void, CacheError | DataSourceError>> {
    try {
      const ok: boolean = await this.redis.delete(REDIS_REGION_KEY);

      if (ok) {
        return Success.of<DataSourceError>();
      }

      return Failure.of<CacheError>(new CacheError('FAIL TO DELETE CACHE'));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<RedisError>(err);
      }

      throw err;
    }
  }
}
