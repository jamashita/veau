import { Nullable } from '@jamashita/anden-type';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { RegionJSON } from '../../../domain/vo/Region/Region';
import { Regions } from '../../../domain/vo/Region/Regions';
import { REDIS_REGION_KEY } from '../../../infrastructure/VeauRedis';
import { ARegionQuery } from '../abstract/ARegionQuery';
import { IRegionQuery } from '../interface/IRegionQuery';
import { IRedisQuery } from './IRedisQuery';

@injectable()
export class RegionRedisQuery extends ARegionQuery<RedisError, 'Redis'> implements IRegionQuery<RedisError>, IRedisQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    super();
    this.redis = redis;
  }

  public all(): Superposition<Regions, RedisError | RegionError> {
    return Superposition.playground<Nullable<string>, RedisError>(() => {
      return this.redis.getString().get(REDIS_REGION_KEY);
    }, RedisError).map<string, UnscharferelationError>((str: Nullable<string>) => {
      return Unscharferelation.maybe(str).toSuperposition();
    }).map<Array<RegionJSON>, JSONAError>((j: string) => {
      return JSONA.parse<Array<RegionJSON>>(j);
    }, JSONAError).map<Regions, RegionError>((json: Array<RegionJSON>) => {
      return Regions.ofJSON(json);
    }, RegionError).recover<Regions, RedisError | RegionError>((err: JSONAError | RedisError | RegionError | UnscharferelationError) => {
      if (err instanceof JSONAError) {
        throw new RedisError('RegionBinQuery.all()', err);
      }
      if (err instanceof UnscharferelationError) {
        throw new RedisError('RegionBinQuery.all()', err);
      }

      throw err;
    }, RegionError, RedisError);
  }
}
