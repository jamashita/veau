import { Kind, Nullable } from '@jamashita/anden-type';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Alive, Contradiction, Dead, Schrodinger } from '@jamashita/genitore-schrodinger';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { inject, injectable } from 'inversify';
import { Types } from '../../../../container/Types';
import { ISO3166 } from '../../../../domain/Region/ISO3166';
import { Region, RegionJSON } from '../../../../domain/Region/Region';
import { RegionError } from '../../../../domain/Region/RegionError';
import { RegionID } from '../../../../domain/Region/RegionID';
import { RegionRepository } from '../../../../domain/Region/RegionRepository';
import { Regions } from '../../../../domain/Region/Regions';
import { REDIS_REGION_KEY } from '../../../../infrastructure/VeauRedis';
import { NoSuchElementError } from '../../../../repository/query/error/NoSuchElementError';
import { MixinRegionRepository } from '../../mixin/MixinRegionRepository';

const DURATION: number = 3 * 60 * 60;

@injectable()
export class RedisRegionRepository implements RegionRepository<RedisError> {
  private readonly redis: IRedis;

  public constructor(@inject(Types.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async all(): Promise<Schrodinger<Regions, RedisError | RegionError>> {
    try {
      const str: Nullable<string> = await this.redis.getString().get(REDIS_REGION_KEY);

      if (Kind.isNull(str)) {
        return Dead.of(new RedisError('RedisRegionRepository.all()'));
      }

      const json: Array<RegionJSON> = await JSONA.parse(str);

      return Alive.of(Regions.ofJSON(json));
    }
    catch (e: unknown) {
      if (e instanceof RedisError) {
        return Dead.of(e);
      }
      if (e instanceof JSONAError) {
        return Dead.of(new RegionError('RedisRegionRepository.all()', e));
      }
      if (e instanceof RegionError) {
        return Dead.of(e);
      }

      return Contradiction.of(e);
    }
  }

  public async createAll(regions: Regions): Promise<Schrodinger<unknown, RedisError>> {
    try {
      const str: string = await JSONA.stringify(regions.toJSON());
      await this.redis.getString().set(REDIS_REGION_KEY, str);
      await this.redis.expires(REDIS_REGION_KEY, DURATION);

      return Alive.of(null);
    }
    catch (e: unknown) {
      if (e instanceof RedisError) {
        return Dead.of(e);
      }
      if (e instanceof JSONAError) {
        return Dead.of(new RedisError('RedisRegionRepository.createAll()', e));
      }
      if (e instanceof RegionError) {
        return Dead.of(e);
      }

      return Contradiction.of(e);
    }
  }

  public async deleteAll(): Promise<Schrodinger<unknown, RedisError>> {
    const deleted: boolean = await this.redis.delete(REDIS_REGION_KEY);

    if (deleted) {
      return Alive.of(null);
    }

    return Dead.of(new RedisError('FAIL TO DELETE CACHE'));
  }

  public async find(id: RegionID): Promise<Schrodinger<Region, NoSuchElementError | RedisError | RegionError>> {
    const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await this.all();

    if (schrodinger.isDead()) {
      return Dead.of(schrodinger.getError());
    }
    if (schrodinger.isContradiction()) {
      return Contradiction.of(schrodinger.getCause());
    }

    const mixin: MixinRegionRepository = new MixinRegionRepository(schrodinger.get());

    return mixin.find(id);
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Schrodinger<Region, NoSuchElementError | RedisError | RegionError>> {
    const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await this.all();

    if (schrodinger.isDead()) {
      return Dead.of(schrodinger.getError());
    }
    if (schrodinger.isContradiction()) {
      return Contradiction.of(schrodinger.getCause());
    }

    const mixin: MixinRegionRepository = new MixinRegionRepository(schrodinger.get());

    return mixin.findByISO3166(iso3166);
  }
}
