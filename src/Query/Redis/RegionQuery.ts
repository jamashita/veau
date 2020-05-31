import { inject, injectable } from 'inversify';

import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Alive, Dead, Quantum, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { IRedis, RedisError } from '@jamashita/publikum-redis';
import { Nullable } from '@jamashita/publikum-type';

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
export class RegionQuery implements IRegionQuery, IRedisQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async all(): Promise<Superposition<Regions, RegionsError | DataSourceError>> {
    const superposition1: Superposition<Nullable<string>, RedisError> = await Schrodinger.playground<
      Nullable<string>,
      RedisError
    >(() => {
      return this.redis.getString().get(REDIS_REGION_KEY);
    });

    return superposition1.match<Regions, RegionsError | DataSourceError>(
      async (str: Nullable<string>) => {
        if (str === null) {
          return Dead.of<Regions, RedisError>(new RedisError('NO REGIONS FROM REDIS'));
        }

        const superposition2: Superposition<Array<RegionJSON>, JSONAError> = await Schrodinger.playground<
          Array<RegionJSON>,
          JSONAError
        >(() => {
          return JSONA.parse<Array<RegionJSON>>(str);
        });

        return superposition2.match<Regions, RegionsError | DataSourceError>(
          (json: Array<RegionJSON>) => {
            return Regions.ofJSON(json);
          },
          (err: JSONAError) => {
            return Dead.of<Regions, RedisError>(new RedisError('RegionQuery.all()', err));
          }
        );
      },
      (err: RedisError) => {
        return Promise.resolve<Superposition<Regions, RedisError>>(Dead.of<Regions, RedisError>(err));
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(regionID: RegionID): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public async findByISO3166(
    iso3166: ISO3166
  ): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Regions, RegionsError | DataSourceError> = await this.all();

    return superposition.match<Region, RegionError | NoSuchElementError | DataSourceError>(
      (regions: Regions) => {
        const quantum: Quantum<Region> = regions.find((region: Region) => {
          return region.getISO3166().equals(iso3166);
        });

        return quantum.toSuperposition().match<Region, NoSuchElementError | DataSourceError>(
          (region: Region) => {
            return Alive.of<Region, DataSourceError>(region);
          },
          () => {
            return Dead.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.get()));
          }
        );
      },
      (err: RegionsError | DataSourceError) => {
        if (err instanceof RegionsError) {
          return Dead.of<Region, RegionError>(new RegionError('RegionQuery.findByISO3166()', err));
        }

        return Dead.of<Region, DataSourceError>(err);
      }
    );
  }
}
