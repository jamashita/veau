import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { JSONA } from '../veau-general/JSONA';
import { Redis } from '../veau-general/Redis/Redis';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ISO639 } from '../veau-vo/ISO639';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Languages } from '../veau-vo/Languages';
import { ILanguageQuery } from './ILanguageQuery';

const REDIS_KEY: string = 'LANGUAGES';

@injectable()
export class LanguageRedisQuery implements ILanguageQuery {
  private redis: Redis;

  public constructor(@inject(TYPE.Redis) redis: Redis) {
    this.redis = redis;
  }

  public async all(): Promise<Languages> {
    const languagesString: string | null = await this.redis.getString().get(REDIS_KEY);

    if (languagesString === null) {
      return Languages.empty();
    }

    const languageJSONs: Array<LanguageJSON> = await JSONA.parse<Array<LanguageJSON>>(languagesString);

    return Languages.ofJSON(languageJSONs);
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError>> {
    const languages: Languages = await this.all();

    const found: Language | undefined = languages.find((language: Language) => {
      return language.getISO639().equals(iso639);
    });

    if (found === undefined) {
      return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
    }

    return Success.of<Language, NoSuchElementError>(found);
  }
}
