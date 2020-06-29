import { inject, injectable } from 'inversify';

import { UnimplementedError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition } from '@jamashita/publikum-monad';
import { IRedis, RedisError } from '@jamashita/publikum-redis';
import { Kind, Nullable } from '@jamashita/publikum-type';

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
    }).map((str: Nullable<string>) => {
      if (str === null) {
        throw new RedisError('NO REGIONS FROM REDIS');
      }

      return Superposition.playground<Array<RegionJSON>, JSONAError>(() => {
        return JSONA.parse<Array<RegionJSON>>(str);
      }).transform<Regions, RegionsError | RedisError>(
        (json: Array<RegionJSON>) => {
          return Regions.ofJSON(json);
        },
        (err: JSONAError) => {
          throw new RedisError('RegionQuery.all()', err);
        }
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(regionID: RegionID): Superposition<Region, RegionError | NoSuchElementError | RedisError> {
    throw new UnimplementedError();
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, RegionError | NoSuchElementError | RedisError> {
    return this.all().transform<Region, RegionError | NoSuchElementError | RedisError>(
      (regions: Regions) => {
        const region: Nullable<Region> = regions.find((r: Region) => {
          return r.getISO3166().equals(iso3166);
        });

        if (Kind.isNull(region)) {
          throw new NoSuchElementError(iso3166.get());
        }

        return region;
      },
      (err: RegionsError | RedisError) => {
        if (err instanceof RegionsError) {
          throw new RegionError('RegionQuery.findByISO3166()', err);
        }

        throw err;
      }
    );
  }
}
