import { UnimplementedError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { IRedis, RedisError } from '@jamashita/publikum-redis';
import { Nullable } from '@jamashita/publikum-type';
import { inject, injectable } from 'inversify';

import { Type } from '../../Container/Types';
import { REDIS_LANGUAGE_KEY } from '../../Infrastructure/VeauRedis';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../VO/Language/Error/LanguagesError';
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

  public all(): Superposition<Languages, LanguagesError | RedisError> {
    return Superposition.playground<Nullable<string>, RedisError>(() => {
      return this.redis.getString().get(REDIS_LANGUAGE_KEY);
    }, RedisError)
      .map<Languages, LanguagesError | JSONAError | RedisError | UnscharferelationError>((str: Nullable<string>) => {
        return Unscharferelation.maybe<string>(str)
          .toSuperposition()
          .map<Array<LanguageJSON>, JSONAError | UnscharferelationError>((j: string) => {
            return JSONA.parse<Array<LanguageJSON>>(j);
          }, JSONAError)
          .map<Languages, LanguagesError | JSONAError | UnscharferelationError>((json: Array<LanguageJSON>) => {
            return Languages.ofJSON(json);
          }, LanguagesError);
      })
      .recover<Languages, LanguagesError | RedisError>(
        (err: LanguagesError | JSONAError | RedisError | UnscharferelationError) => {
          if (err instanceof JSONAError) {
            throw new RedisError('LanguageQuery.all()', err);
          }
          if (err instanceof UnscharferelationError) {
            throw new RedisError('LanguageQuery.all()', err);
          }

          throw err;
        },
        LanguagesError,
        RedisError
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | RedisError> {
    throw new UnimplementedError();
  }

  public findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | RedisError> {
    return this.all()
      .map<Language, LanguagesError | RedisError | UnscharferelationError>((languages: Languages) => {
        const language: Nullable<Language> = languages.find((l: Language) => {
          return l.getISO639().equals(iso639);
        });

        return Unscharferelation.maybe<Language>(language).toSuperposition();
      })
      .recover<Language, LanguageError | NoSuchElementError | RedisError>(
        (err: LanguagesError | RedisError | UnscharferelationError) => {
          if (err instanceof LanguagesError) {
            throw new LanguageError('LanguageQuery.findByISO639()', err);
          }
          if (err instanceof UnscharferelationError) {
            throw new NoSuchElementError(iso639.get());
          }

          throw err;
        },
        LanguageError,
        NoSuchElementError,
        RedisError
      );
  }
}
