import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Quantum } from '../../General/Quantum/Quantum';
import { IRedis } from '../../General/Redis/Interface/IRedis';
import { RedisError } from '../../General/Redis/RedisError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Superposition } from '../../General/Superposition/Superposition';
import { JSONA } from '../../General/Type/JSONA';
import { JSONAError } from '../../General/Type/JSONAError';
import { Nullable } from '../../General/Type/Value';
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
        return Failure.of<Regions, NoSuchElementError>(
          new NoSuchElementError('NO REGIONS FROM REDIS')
        );
      }

      const regionJSONs: Array<RegionJSON> = await JSONA.parse<Array<RegionJSON>>(regionString);

      return Success.of<Regions, DataSourceError>(Regions.ofJSON(regionJSONs));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<Regions, RedisError>(err);
      }
      if (err instanceof JSONAError) {
        return Failure.of<Regions, RedisError>(new RedisError('RegionQuery.all()', err));
      }

      throw err;
    }
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, NoSuchElementError | DataSourceError>> {
    const trial: Superposition<Regions, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Region, NoSuchElementError | DataSourceError>((regions: Regions) => {
      const quantum: Quantum<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      return quantum.toTry().match<Region, NoSuchElementError | DataSourceError>((region: Region) => {
        return Success.of<Region, DataSourceError>(region);
      }, () => {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.get()));
      });
    }, (err: NoSuchElementError | DataSourceError) => {
      return Failure.of<Region, NoSuchElementError | DataSourceError>(err);
    });
  }
}
