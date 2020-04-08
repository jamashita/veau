import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { JSONA } from '../../veau-general/JSONA';
import { IRedis } from '../../veau-general/Redis/interfaces/IRedis';
import { RedisError } from '../../veau-general/Redis/RedisError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Ambiguous, Nullable } from '../../veau-general/Type/Value';
import { REDIS_LANGUAGE_KEY } from '../../veau-infrastructure/VeauRedis';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language, LanguageJSON } from '../../veau-vo/Language';
import { Languages } from '../../veau-vo/Languages';
import { ILanguageQuery } from '../interfaces/ILanguageQuery';
import { IRedisQuery } from '../interfaces/IRedisQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IRedisQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(TYPE.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async all(): Promise<Try<Languages, NoSuchElementError | DataSourceError>> {
    try {
      const languagesString: Nullable<string> = await this.redis.getString().get(REDIS_LANGUAGE_KEY);

      if (languagesString === null) {
        return Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('NO LANGUAGES FROM REDIS'));
      }

      const languageJSONs: Array<LanguageJSON> = await JSONA.parse<Array<LanguageJSON>>(languagesString);

      return Success.of<Languages, NoSuchElementError>(Languages.ofJSON(languageJSONs));
    }
    catch (err) {
      if (err instanceof RedisError) {
        return Failure.of<Languages, DataSourceError>(err);
      }

      throw err;
    }
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    const trial: Try<Languages, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Try<Language, NoSuchElementError | DataSourceError>>((languages: Languages) => {
      const found: Ambiguous<Language> = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      if (found === undefined) {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      }

      return Success.of<Language, NoSuchElementError>(found);
    }, (err: NoSuchElementError | DataSourceError) => {
      // TODO
      return Failure.of<Language, NoSuchElementError | DataSourceError>(err);
    });
  }
}
