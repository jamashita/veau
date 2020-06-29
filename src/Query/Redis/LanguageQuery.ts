import { inject, injectable } from 'inversify';

import { UnimplementedError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Superposition } from '@jamashita/publikum-monad';
import { IRedis, RedisError } from '@jamashita/publikum-redis';
import { Kind, Nullable } from '@jamashita/publikum-type';

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
    }).map<Languages, LanguagesError | RedisError>((str: Nullable<string>) => {
      if (str === null) {
        throw new RedisError('NO LANGUAGES FROM REDIS');
      }

      return Superposition.playground<Array<LanguageJSON>, JSONAError>(() => {
        return JSONA.parse<Array<LanguageJSON>>(str);
      }).transform<Languages, LanguagesError | RedisError>(
        (json: Array<LanguageJSON>) => {
          return Languages.ofJSON(json);
        },
        (err: JSONAError) => {
          throw new RedisError('LanguageQuery.all()', err);
        }
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | RedisError> {
    throw new UnimplementedError();
  }

  public findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | RedisError> {
    return this.all().transform<Language, LanguageError | NoSuchElementError | RedisError>(
      (languages: Languages) => {
        const language: Nullable<Language> = languages.find((l: Language) => {
          return l.getISO639().equals(iso639);
        });

        if (Kind.isNull(language)) {
          throw new NoSuchElementError(iso639.get());
        }

        return language;
      },
      (err: LanguagesError | RedisError) => {
        if (err instanceof LanguagesError) {
          throw new LanguageError('LanguageQuery.findByISO639()', err);
        }

        throw err;
      }
    );
  }
}
