import { UnimplementedError } from '@jamashita/anden-error';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore-superposition';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Nullable } from '@jamashita/anden-type';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { REDIS_REGION_KEY } from '../../Infrastructure/VeauRedis';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region, RegionJSON } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IRedisQuery } from './Interface/IRedisQuery';

@injectable()
export class RegionQuery implements IRegionQuery<RedisError>, IRedisQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public all(): Superposition<Regions, RedisError | RegionError> {
    return Superposition.playground<Nullable<string>, RedisError>(() => {
      return this.redis.getString().get(REDIS_REGION_KEY);
    }, RedisError).map<string, RedisError | UnscharferelationError>((str: Nullable<string>) => {
      return Unscharferelation.maybe(str).toSuperposition();
    }).map<Array<RegionJSON>, JSONAError | RedisError | UnscharferelationError>((j: string) => {
      return JSONA.parse<Array<RegionJSON>>(j);
    }, JSONAError).map<Regions, JSONAError | RedisError | RegionError | UnscharferelationError>((json: Array<RegionJSON>) => {
      return Regions.ofJSON(json);
    }, RegionError).recover<Regions, RedisError | RegionError>((err: JSONAError | RedisError | RegionError | UnscharferelationError) => {
      if (err instanceof JSONAError) {
        throw new RedisError('RegionQuery.all()', err);
      }
      if (err instanceof UnscharferelationError) {
        throw new RedisError('RegionQuery.all()', err);
      }

      throw err;
    }, RegionError, RedisError);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_regionID: RegionID): Superposition<Region, NoSuchElementError | RedisError | RegionError> {
    throw new UnimplementedError();
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, NoSuchElementError | RedisError | RegionError> {
    return this.all().map<Region, RedisError | RegionError | UnscharferelationError>((regions: Regions) => {
      const region: Nullable<Region> = regions.find((r: Region) => {
        return r.getISO3166().equals(iso3166);
      });

      return Unscharferelation.maybe<Region>(region).toSuperposition();
    }).recover<Region, NoSuchElementError | RedisError | RegionError>((err: RedisError | RegionError | UnscharferelationError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(iso3166.get());
      }

      throw err;
    }, RegionError, NoSuchElementError, RedisError);
  }
}
