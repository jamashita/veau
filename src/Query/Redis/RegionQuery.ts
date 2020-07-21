import { UnimplementedError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { IRedis, RedisError } from '@jamashita/publikum-redis';
import { Nullable } from '@jamashita/publikum-type';
import { inject, injectable } from 'inversify';

import { Type } from '../../Container/Types';
import { REDIS_REGION_KEY } from '../../Infrastructure/VeauRedis';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
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

  public all(): Superposition<Regions, RegionsError | RedisError> {
    return Superposition.playground<Nullable<string>, RedisError>(() => {
      return this.redis.getString().get(REDIS_REGION_KEY);
    }, RedisError)
      .map<Regions, RegionsError | JSONAError | RedisError | UnscharferelationError>((str: Nullable<string>) => {
        return Unscharferelation.maybe(str)
          .toSuperposition()
          .map<Array<RegionJSON>, JSONAError | UnscharferelationError>((j: string) => {
            return JSONA.parse<Array<RegionJSON>>(j);
          }, JSONAError)
          .map<Regions, RegionsError | JSONAError | UnscharferelationError>((json: Array<RegionJSON>) => {
            return Regions.ofJSON(json);
          }, RegionsError);
      })
      .recover<Regions, RegionsError | RedisError>(
        (err: RegionsError | JSONAError | RedisError | UnscharferelationError) => {
          if (err instanceof JSONAError) {
            throw new RedisError('RegionQuery.all()', err);
          }
          if (err instanceof UnscharferelationError) {
            throw new RedisError('RegionQuery.all()', err);
          }

          throw err;
        },
        RegionsError,
        RedisError
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_regionID: RegionID): Superposition<Region, RegionError | NoSuchElementError | RedisError> {
    throw new UnimplementedError();
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, RegionError | NoSuchElementError | RedisError> {
    return this.all()
      .map<Region, RegionsError | RedisError | UnscharferelationError>((regions: Regions) => {
        const region: Nullable<Region> = regions.find((r: Region) => {
          return r.getISO3166().equals(iso3166);
        });

        return Unscharferelation.maybe<Region>(region).toSuperposition();
      })
      .recover<Region, RegionError | NoSuchElementError | RedisError>(
        (err: RegionsError | RedisError | UnscharferelationError) => {
          if (err instanceof RegionsError) {
            throw new RegionError('RegionQuery.findByISO3166()', err);
          }
          if (err instanceof UnscharferelationError) {
            throw new NoSuchElementError(iso3166.get());
          }

          throw err;
        },
        RegionError,
        NoSuchElementError,
        RedisError
      );
  }
}
