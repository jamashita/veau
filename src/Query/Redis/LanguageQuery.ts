import { inject, injectable } from 'inversify';

import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Alive, Dead, Quantum, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { IRedis, RedisError } from '@jamashita/publikum-redis';
import { Nullable } from '@jamashita/publikum-type';

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
export class LanguageQuery implements ILanguageQuery, IRedisQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async all(): Promise<Superposition<Languages, LanguagesError | DataSourceError>> {
    const superposition1: Superposition<Nullable<string>, RedisError> = await Schrodinger.sandbox<
      Nullable<string>,
      RedisError
    >(() => {
      return this.redis.getString().get(REDIS_LANGUAGE_KEY);
    });

    return superposition1.transform<Languages, LanguagesError | DataSourceError>(
      async (str: Nullable<string>) => {
        if (str === null) {
          return Dead.of<Languages, RedisError>(new RedisError('NO LANGUAGES FROM REDIS'));
        }

        const superposition2: Superposition<Array<LanguageJSON>, JSONAError> = await Schrodinger.sandbox<
          Array<LanguageJSON>,
          JSONAError
        >(() => {
          return JSONA.parse<Array<LanguageJSON>>(str);
        });

        return superposition2.transform<Languages, LanguagesError | DataSourceError>(
          (json: Array<LanguageJSON>) => {
            return Languages.ofJSON(json);
          },
          (err: JSONAError) => {
            return Dead.of<Languages, RedisError>(new RedisError('LanguageQuery.all()', err));
          }
        );
      },
      (err: RedisError) => {
        return Promise.resolve<Superposition<Languages, RedisError>>(Dead.of<Languages, RedisError>(err));
      }
    );
  }

  public find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    languageID: LanguageID
  ): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public async findByISO639(
    iso639: ISO639
  ): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await this.all();

    return superposition.transform<Language, LanguageError | NoSuchElementError | DataSourceError>(
      (languages: Languages) => {
        const quantum: Quantum<Language> = languages.find((language: Language) => {
          return language.getISO639().equals(iso639);
        });

        return quantum.toSuperposition().transform<Language, NoSuchElementError | DataSourceError>(
          (language: Language) => {
            return Alive.of<Language, DataSourceError>(language);
          },
          () => {
            return Dead.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.get()));
          }
        );
      },
      (err: LanguagesError | DataSourceError) => {
        if (err instanceof LanguagesError) {
          return Dead.of<Language, LanguageError>(new LanguageError('LanguageQuery.findByISO639()', err));
        }

        return Dead.of<Language, DataSourceError>(err);
      }
    );
  }
}
