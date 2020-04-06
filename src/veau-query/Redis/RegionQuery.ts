import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { JSONA } from '../../veau-general/JSONA';
import { Redis } from '../../veau-general/Redis/Redis';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region, RegionJSON } from '../../veau-vo/Region';
import { Regions } from '../../veau-vo/Regions';
import { IRedisQuery } from '../interfaces/IRedisQuery';
import { IRegionQuery } from '../interfaces/IRegionQuery';

const REDIS_KEY: string = 'REGIONS';

@injectable()
export class RegionQuery implements IRegionQuery, IRedisQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: Redis;

  public constructor(@inject(TYPE.Redis) redis: Redis) {
    this.redis = redis;
  }

  public async all(): Promise<Try<Regions, NoSuchElementError>> {
    const regionString: string | null = await this.redis.getString().get(REDIS_KEY);

    if (regionString === null) {
      return Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('NO REGIONS FROM REDIS'));
    }

    const regionJSONs: Array<RegionJSON> = await JSONA.parse<Array<RegionJSON>>(regionString);

    return Success.of<Regions, NoSuchElementError>(Regions.ofJSON(regionJSONs));
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError>> {
    const trial: Try<Regions, NoSuchElementError> = await this.all();

    return trial.match<Try<Region, NoSuchElementError>>((regions: Regions) => {
      const found: Region | undefined = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      if (found === undefined) {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      }

      return Success.of<Region, NoSuchElementError>(found);
    }, (err: NoSuchElementError) => {
      return Failure.of<Region, NoSuchElementError>(err);
    });
  }
}
