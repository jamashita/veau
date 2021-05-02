import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Superposition } from '@jamashita/genitore';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { REDIS_REGION_KEY } from '../../Infrastructure/VeauRedis';
import { Regions } from '../../VO/Region/Regions';
import { IRegionCommand } from '../Interface/IRegionCommand';
import { IRedisCommand } from './Interface/IRedisCommand';

const DURATION: number = 3 * 60 * 60;

@injectable()
export class RegionCommand implements IRegionCommand<RedisError>, IRedisCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public deleteAll(): Superposition<unknown, RedisError> {
    return Superposition.playground<boolean, RedisError>(() => {
      return this.redis.delete(REDIS_REGION_KEY);
    }, RedisError).map<unknown, RedisError>((ok: boolean) => {
      if (ok) {
        return null;
      }

      throw new RedisError('FAIL TO DELETE CACHE');
    });
  }

  public insertAll(regions: Regions): Superposition<unknown, RedisError> {
    return Superposition.playground<string, JSONAError>(() => {
      return JSONA.stringify(regions.toJSON());
    }, JSONAError).transform<unknown, RedisError>(async (str: string) => {
      await this.redis.getString().set(REDIS_REGION_KEY, str);

      return this.redis.expires(REDIS_REGION_KEY, DURATION);
    }, (err: JSONAError) => {
      throw new RedisError('RegionCommand.insertAll()', err);
    }, RedisError);
  }
}
