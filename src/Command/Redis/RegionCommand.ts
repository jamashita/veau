import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { DataSourceError } from '../../General/DataSourceError';
import { IRedis } from '../../General/Redis/Interface/IRedis';
import { RedisError } from '../../General/Redis/RedisError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Try } from '../../General/Superposition/Try';
import { JSONA } from '../../General/Type/JSONA';
import { REDIS_REGION_KEY } from '../../Infrastructure/VeauRedis';
import { Regions } from '../../VO/Regions';
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

  public async deleteAll(): Promise<Try<void, DataSourceError>> {
    try {
      const ok: boolean = await this.redis.delete(REDIS_REGION_KEY);

      if (ok) {
        return Success.of<DataSourceError>();
      }

      return Failure.of<DataSourceError>(new RedisError('FAIL TO DELETE CACHE'));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<RedisError>(err);
      }

      throw err;
    }
  }
}
