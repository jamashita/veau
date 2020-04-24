import { inject, injectable } from 'inversify';
import {
  Alive,
  DataSourceError,
  Dead,
  IRedis,
  JSONA,
  JSONAError,
  Nullable,
  Quantum,
  RedisError,
  Superposition
} from 'publikum';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { REDIS_REGION_KEY } from '../../Infrastructure/VeauRedis';
import { ISO3166 } from '../../VO/ISO3166';
import { Region, RegionJSON } from '../../VO/Region';
import { Regions } from '../../VO/Regions';
import { IRedisQuery } from '../Interface/IRedisQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IRedisQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(TYPE.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async all(): Promise<Superposition<Regions, NoSuchElementError | DataSourceError>> {
    try {
      const regionString: Nullable<string> = await this.redis.getString().get(REDIS_REGION_KEY);

      if (regionString === null) {
        return Dead.of<Regions, NoSuchElementError>(
          new NoSuchElementError('NO REGIONS FROM REDIS')
        );
      }

      const regionJSONs: Array<RegionJSON> = await JSONA.parse<Array<RegionJSON>>(regionString);

      return Alive.of<Regions, DataSourceError>(Regions.ofJSON(regionJSONs));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Dead.of<Regions, RedisError>(err);
      }
      if (err instanceof JSONAError) {
        return Dead.of<Regions, RedisError>(new RedisError('RegionQuery.all()', err));
      }

      throw err;
    }
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await this.all();

    return superposition.match<Region, NoSuchElementError | DataSourceError>((regions: Regions) => {
      const quantum: Quantum<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      return quantum.toSuperposition().match<Region, NoSuchElementError | DataSourceError>((region: Region) => {
        return Alive.of<Region, DataSourceError>(region);
      }, () => {
        return Dead.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.get()));
      });
    }, (err: NoSuchElementError | DataSourceError) => {
      return Dead.of<Region, NoSuchElementError | DataSourceError>(err);
    });
  }
}
