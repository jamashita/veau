import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { JSONA } from '../../veau-general/JSONA';
import { IRedis } from '../../veau-general/Redis/interfaces/IRedis';
import { RedisError } from '../../veau-general/Redis/RedisError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Ambiguous, Nullable } from '../../veau-general/Type/Value';
import { REDIS_REGION_KEY } from '../../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region, RegionJSON } from '../../veau-vo/Region';
import { Regions } from '../../veau-vo/Regions';
import { IRedisQuery } from '../interfaces/IRedisQuery';
import { IRegionQuery } from '../interfaces/IRegionQuery';

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

      return Success.of<Regions, NoSuchElementError>(Regions.ofJSON(regionJSONs));
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
      const found: Ambiguous<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      if (found === undefined) {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      }

      return Success.of<Region, NoSuchElementError | DataSourceError>(found);
    }, (err: NoSuchElementError | DataSourceError) => {
      return Failure.of<Region, NoSuchElementError | DataSourceError>(err);
    });
  }
}
