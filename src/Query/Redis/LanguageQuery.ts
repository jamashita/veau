import { UnimplementedError } from '@jamashita/anden-error';
import { JSONA, JSONAError } from '@jamashita/steckdose-json';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore-superposition';
import { IRedis, RedisError } from '@jamashita/catacombe-redis';
import { Nullable } from '@jamashita/anden-type';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { REDIS_LANGUAGE_KEY } from '../../Infrastructure/VeauRedis';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language, LanguageJSON } from '../../VO/Language/Language';
import { LanguageID } from '../../VO/Language/LanguageID';
import { Languages } from '../../VO/Language/Languages';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IRedisQuery } from './Interface/IRedisQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery<RedisError>, IRedisQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public all(): Superposition<Languages, LanguageError | RedisError> {
    return Superposition.playground<Nullable<string>, RedisError>(() => {
      return this.redis.getString().get(REDIS_LANGUAGE_KEY);
    }, RedisError).map<string, UnscharferelationError | RedisError>((str: Nullable<string>) => {
      return Unscharferelation.maybe<string>(str).toSuperposition();
    }).map<Array<LanguageJSON>, JSONAError | UnscharferelationError | RedisError>((j: string) => {
      return JSONA.parse<Array<LanguageJSON>>(j);
    }, JSONAError).map<Languages, LanguageError | JSONAError | UnscharferelationError | RedisError>((json: Array<LanguageJSON>) => {
      return Languages.ofJSON(json);
    }, LanguageError).recover<Languages, LanguageError | RedisError>((err: LanguageError | JSONAError | UnscharferelationError | RedisError) => {
      if (err instanceof JSONAError) {
        throw new LanguageError('LanguageQuery.all()', err);
      }
      if (err instanceof UnscharferelationError) {
        throw new RedisError('LanguageQuery.all()', err);
      }

      throw err;
    }, LanguageError, RedisError);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | RedisError> {
    throw new UnimplementedError();
  }

  public findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | RedisError> {
    return this.all().map<Language, LanguageError | RedisError | UnscharferelationError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getISO639().equals(iso639);
      });

      return Unscharferelation.maybe<Language>(language).toSuperposition();
    }).recover<Language, LanguageError | NoSuchElementError | RedisError>((err: LanguageError | RedisError | UnscharferelationError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(iso639.get());
      }

      throw err;
    }, LanguageError, NoSuchElementError, RedisError);
  }
}
