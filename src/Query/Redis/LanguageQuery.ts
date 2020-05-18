import { inject, injectable } from 'inversify';
import {
  Alive,
  DataSourceError,
  Dead,
  IRedis,
  JSONA,
  JSONAError,
  Nullable,
  Quantum,
  RedisError,
  Schrodinger,
  Superposition,
  UnimplementedError
} from 'publikum';
import { TYPE } from '../../Container/Types';
import { LanguageError } from '../../Error/LanguageError';
import { LanguagesError } from '../../Error/LanguagesError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { REDIS_LANGUAGE_KEY } from '../../Infrastructure/VeauRedis';
import { ISO639 } from '../../VO/ISO639';
import { Language, LanguageJSON } from '../../VO/Language';
import { LanguageID } from '../../VO/LanguageID';
import { Languages } from '../../VO/Languages';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IRedisQuery } from '../Interface/IRedisQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IRedisQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(TYPE.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async all(): Promise<Superposition<Languages, LanguagesError | DataSourceError>> {
    const superposition1: Superposition<Nullable<string>, RedisError> = await Schrodinger.playground<
      Nullable<string>,
      RedisError
    >(() => {
      return this.redis.getString().get(REDIS_LANGUAGE_KEY);
    });

    return superposition1.match<Languages, LanguagesError | DataSourceError>(
      async (str: Nullable<string>) => {
        if (str === null) {
          return Dead.of<Languages, RedisError>(new RedisError('NO LANGUAGES FROM REDIS'));
        }

        const superposition2: Superposition<Array<LanguageJSON>, JSONAError> = await Schrodinger.playground<
          Array<LanguageJSON>,
          JSONAError
        >(() => {
          return JSONA.parse<Array<LanguageJSON>>(str);
        });

        return superposition2.match<Languages, LanguagesError | DataSourceError>(
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

    return superposition.match<Language, LanguageError | NoSuchElementError | DataSourceError>(
      (languages: Languages) => {
        const quantum: Quantum<Language> = languages.find((language: Language) => {
          return language.getISO639().equals(iso639);
        });

        return quantum.toSuperposition().match<Language, NoSuchElementError | DataSourceError>(
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
