import { inject, injectable } from 'inversify';
import { LanguageCommand } from '../veau-command/LanguageCommand';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { JSONA } from '../veau-general/JSONA';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { Redis } from '../veau-general/Redis/Redis';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ISO639 } from '../veau-vo/ISO639';
import { Language, LanguageJSON, LanguageRow } from '../veau-vo/Language';
import { Languages } from '../veau-vo/Languages';

const REDIS_KEY: string = 'LANGUAGES';

@injectable()
export class LanguageQuery {
  private mysql: MySQL;
  private redis: Redis;
  private languageCommand: LanguageCommand;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL,
    @inject(TYPE.Redis) redis: Redis,
    @inject(TYPE.LanguageCommand) languageCommand: LanguageCommand
  ) {
    this.mysql = mysql;
    this.redis = redis;
    this.languageCommand = languageCommand;
  }

  public async all(): Promise<Languages> {
    const languagesString: string | null = await this.redis.getString().get(REDIS_KEY);

    if (languagesString !== null) {
      const languageJSONs: Array<LanguageJSON> = await JSONA.parse<Array<LanguageJSON>>(languagesString);
      return Languages.ofJSON(languageJSONs);
    }

    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`;

    const languageRows: Array<LanguageRow> = await this.mysql.execute<Array<LanguageRow>>(query);
    const languages: Languages = Languages.ofRow(languageRows);

    await this.languageCommand.insertAll(languages);

    return languages;
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError>> {
    const languages: Languages = await this.all();
    const found: Language | undefined = languages.find((language: Language): boolean => {
      return language.getISO639().equals(iso639);
    });

    if (found === undefined) {
      return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
    }

    return Success.of<Language, NoSuchElementError>(found);
  }
}
