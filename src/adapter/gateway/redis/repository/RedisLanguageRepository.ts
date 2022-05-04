import { Kind, Nullable } from '@jamashita/anden-type';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Alive, Contradiction, Dead, Schrodinger } from '@jamashita/genitore-schrodinger';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { inject, injectable } from 'inversify';
import { Types } from '../../../../container/Types';
import { ISO639 } from '../../../../domain/Language/ISO639';
import { Language, LanguageJSON } from '../../../../domain/Language/Language';
import { LanguageError } from '../../../../domain/Language/LanguageError';
import { LanguageID } from '../../../../domain/Language/LanguageID';
import { LanguageRepository } from '../../../../domain/Language/LanguageRepository';
import { Languages } from '../../../../domain/Language/Languages';
import { REDIS_LANGUAGE_KEY } from '../../../../infrastructure/VeauRedis';
import { NoSuchElementError } from '../../../../repository/query/error/NoSuchElementError';
import { MixinLanguageRepository } from '../../mixin/MixinLanguageRepository';

const DURATION: number = 3 * 60 * 60;

@injectable()
export class RedisLanguageRepository implements LanguageRepository<RedisError> {
  private readonly redis: IRedis;

  public constructor(@inject(Types.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async all(): Promise<Schrodinger<Languages, LanguageError | RedisError>> {
    try {
      const str: Nullable<string> = await this.redis.getString().get(REDIS_LANGUAGE_KEY);

      if (Kind.isNull(str)) {
        return Dead.of(new RedisError('LanguageBinQuery.all()'));
      }

      const json: Array<LanguageJSON> = await JSONA.parse<Array<LanguageJSON>>(str);

      return Alive.of(Languages.ofJSON(json));
    }
    catch (e: unknown) {
      if (e instanceof RedisError) {
        return Dead.of(e);
      }
      if (e instanceof JSONAError) {
        return Dead.of(new LanguageError('LanguageBinQuery.all()', e));
      }
      if (e instanceof LanguageError) {
        return Dead.of(e);
      }

      return Contradiction.of(e);
    }
  }

  public async createAll(languages: Languages): Promise<Schrodinger<unknown, RedisError>> {
    try {
      const str: string = await JSONA.stringify(languages.toJSON());
      await this.redis.getString().set(REDIS_LANGUAGE_KEY, str);
      await this.redis.expires(REDIS_LANGUAGE_KEY, DURATION);

      return Alive.of(null);
    }
    catch (e: unknown) {
      if (e instanceof RedisError) {
        return Dead.of(e);
      }
      if (e instanceof JSONAError) {
        return Dead.of(new RedisError('RedisLanguageRepository.insertAll()', e));
      }
      if (e instanceof LanguageError) {
        return Dead.of(e);
      }

      return Contradiction.of(e);
    }
  }

  public async deleteAll(): Promise<Schrodinger<unknown, RedisError>> {
    const deleted: boolean = await this.redis.delete(REDIS_LANGUAGE_KEY);

    if (deleted) {
      return Alive.of(null);
    }

    return Dead.of(new RedisError('FAIL TO DELETE CACHE'));
  }

  public async find(id: LanguageID): Promise<Schrodinger<Language, LanguageError | NoSuchElementError | RedisError>> {
    const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await this.all();

    if (schrodinger.isDead()) {
      return Dead.of(schrodinger.getError());
    }
    if (schrodinger.isContradiction()) {
      return Contradiction.of(schrodinger.getCause());
    }

    const mixin: MixinLanguageRepository = new MixinLanguageRepository<RedisError>(schrodinger.get());

    return mixin.find(id);
  }

  public async findByISO639(iso639: ISO639): Promise<Schrodinger<Language, LanguageError | NoSuchElementError | RedisError>> {
    const schrodinger: Schrodinger<Languages, LanguageError | RedisError> = await this.all();

    if (schrodinger.isDead()) {
      return Dead.of(schrodinger.getError());
    }
    if (schrodinger.isContradiction()) {
      return Contradiction.of(schrodinger.getCause());
    }

    const mixin: MixinLanguageRepository = new MixinLanguageRepository<RedisError>(schrodinger.get());

    return mixin.findByISO639(iso639);
  }
}
