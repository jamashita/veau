import { Kind, Nullable } from '@jamashita/anden-type';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Superposition } from '@jamashita/genitore-superposition';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { RegionError } from '../../../domain/vo/Region/error/RegionError.js';
import { RegionJSON } from '../../../domain/vo/Region/Region.js';
import { Regions } from '../../../domain/vo/Region/Regions.js';
import { REDIS_REGION_KEY } from '../../../infrastructure/VeauRedis.js';
import { ARegionQuery } from '../ARegionQuery.js';
import { IRegionQuery } from '../IRegionQuery.js';
import { IRedisQuery } from './IRedisQuery.js';

@injectable()
export class RegionRedisQuery extends ARegionQuery<RedisError, 'Redis'> implements IRegionQuery<RedisError>, IRedisQuery {
  public override readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    super();
    this.redis = redis;
  }

  public all(): Superposition<Regions, RedisError | RegionError> {
    return Superposition.playground<Nullable<string>, RedisError>(() => {
      return this.redis.getString().get(REDIS_REGION_KEY);
    }, RedisError).map<Array<RegionJSON>, RedisError>((str: Nullable<string>) => {
      if (Kind.isNull(str)) {
        throw new RedisError('RegionBinQuery.all()');
      }

      return JSONA.parse<Array<RegionJSON>>(j);
    }).map<Regions, RegionError>((json: Array<RegionJSON>) => {
      return Regions.ofJSON(json);
    }, RegionError).recover<Regions, RedisError | RegionError>((err: JSONAError | RedisError | RegionError | UnscharferelationError) => {
      if (err instanceof JSONAError) {
        throw new RedisError('RegionBinQuery.all()', err);
      }

      throw err;
    }, RegionError, RedisError);
  }
}
