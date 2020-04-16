import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Quantum } from '../../General/Quantum/Quantum';
import { IRedis } from '../../General/Redis/Interface/IRedis';
import { RedisError } from '../../General/Redis/RedisError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Superposition } from '../../General/Superposition/Superposition';
import { JSONA } from '../../General/Type/JSONA';
import { JSONAError } from '../../General/Type/JSONAError';
import { Nullable } from '../../General/Type/Value';
import { REDIS_LANGUAGE_KEY } from '../../Infrastructure/VeauRedis';
import { ISO639 } from '../../VO/ISO639';
import { Language, LanguageJSON } from '../../VO/Language';
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

  public async all(): Promise<Superposition<Languages, NoSuchElementError | DataSourceError>> {
    try {
      const languagesString: Nullable<string> = await this.redis.getString().get(REDIS_LANGUAGE_KEY);

      if (languagesString === null) {
        return Failure.of<Languages, NoSuchElementError>(
          new NoSuchElementError('NO LANGUAGES FROM REDIS')
        );
      }

      const languageJSONs: Array<LanguageJSON> = await JSONA.parse<Array<LanguageJSON>>(languagesString);

      return Success.of<Languages, DataSourceError>(Languages.ofJSON(languageJSONs));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<Languages, RedisError>(err);
      }
      if (err instanceof JSONAError) {
        return Failure.of<Languages, RedisError>(
          new RedisError('LanguageQuery.all()', err)
        );
      }

      throw err;
    }
  }

  public async findByISO639(iso639: ISO639): Promise<Superposition<Language, NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await this.all();

    return superposition.match<Language, NoSuchElementError | DataSourceError>((languages: Languages) => {
      const quantum: Quantum<Language> = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      return quantum.toSuperposition().match<Language, NoSuchElementError | DataSourceError>((language: Language) => {
        return Success.of<Language, DataSourceError>(language);
      }, () => {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.get()));
      });
    }, (err: NoSuchElementError | DataSourceError) => {
      return Failure.of<Language, NoSuchElementError | DataSourceError>(err);
    });
  }
}
