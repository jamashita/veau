import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { JSONA } from '../../General/JSONA';
import { Optional } from '../../General/Optional/Optional';
import { IRedis } from '../../General/Redis/Interface/IRedis';
import { RedisError } from '../../General/Redis/RedisError';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
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

  public async all(): Promise<Try<Regions, NoSuchElementError | DataSourceError>> {
    try {
      const regionString: Nullable<string> = await this.redis.getString().get(REDIS_REGION_KEY);

      if (regionString === null) {
        return Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('NO REGIONS FROM REDIS'));
      }

      const regionJSONs: Array<RegionJSON> = await JSONA.parse<Array<RegionJSON>>(regionString);

      return Success.of<Regions, DataSourceError>(Regions.ofJSON(regionJSONs));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<Regions, DataSourceError>(err);
      }

      throw err;
    }
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>> {
    const trial: Try<Regions, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Try<Region, NoSuchElementError | DataSourceError>>((regions: Regions) => {
      const optional: Optional<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      return optional.toTry().match<Try<Region, NoSuchElementError | DataSourceError>>((region: Region) => {
        return Success.of<Region, DataSourceError>(region);
      }, () => {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      });
    }, (err: NoSuchElementError | DataSourceError) => {
      return Failure.of<Region, NoSuchElementError | DataSourceError>(err);
    });
  }
}
