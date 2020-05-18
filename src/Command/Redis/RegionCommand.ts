import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, IRedis, JSONA, RedisError, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
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

  public async insertAll(regions: Regions): Promise<Superposition<void, DataSourceError>> {
    // prettier-ignore
    try {
      const str: string = await JSONA.stringify(regions.toJSON());
      await this.redis.getString().set(REDIS_REGION_KEY, str);
      await this.redis.expires(REDIS_REGION_KEY, DURATION);

      return Alive.of<DataSourceError>();
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Dead.of<RedisError>(err);
      }

      throw err;
    }
  }

  public async deleteAll(): Promise<Superposition<void, DataSourceError>> {
    // prettier-ignore
    try {
      const ok: boolean = await this.redis.delete(REDIS_REGION_KEY);

      if (ok) {
        return Alive.of<DataSourceError>();
      }

      return Dead.of<DataSourceError>(new RedisError('FAIL TO DELETE CACHE'));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Dead.of<RedisError>(err);
      }

      throw err;
    }
  }
}
