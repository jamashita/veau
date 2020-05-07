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
    try {
      const languagesString: Nullable<string> = await this.redis.getString().get(REDIS_LANGUAGE_KEY);

      if (languagesString === null) {
        return Dead.of<Languages, RedisError>(
          new RedisError('NO LANGUAGES FROM REDIS')
        );
      }

      const languageJSONs: Array<LanguageJSON> = await JSONA.parse<Array<LanguageJSON>>(languagesString);

      return Languages.ofJSON(languageJSONs);
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Dead.of<Languages, RedisError>(err);
      }
      if (err instanceof JSONAError) {
        return Dead.of<Languages, RedisError>(
          new RedisError('LanguageQuery.all()', err)
        );
      }

      throw err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(languageID: LanguageID): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    return Promise.reject <Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  public async findByISO639(iso639: ISO639): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await this.all();

    return superposition.match<Language, LanguageError | NoSuchElementError | DataSourceError>((languages: Languages) => {
      const quantum: Quantum<Language> = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      return quantum.toSuperposition().match<Language, NoSuchElementError | DataSourceError>((language: Language) => {
        return Alive.of<Language, DataSourceError>(language);
      }, () => {
        return Dead.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.get()));
      });
    }, (err: LanguagesError | DataSourceError) => {
      if (err instanceof LanguagesError) {
        return Dead.of<Language, LanguageError>(new LanguageError('LanguageQuery.findByISO639()', err));
      }

      return Dead.of<Language, DataSourceError>(err);
    });
  }
}
