import { LanguageCommand } from '../veau-command/LanguageCommand';
import { Languages } from '../veau-entity/collection/Languages';
import { Language, LanguageJSON, LanguageRow } from '../veau-entity/Language';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { veauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO639 } from '../veau-vo/ISO639';

const languageCommand: LanguageCommand = LanguageCommand.getInstance();

const REDIS_KEY: string = 'LANGUAGES';

export class LanguageQuery {
  private static instance: LanguageQuery = new LanguageQuery();

  public static getInstance(): LanguageQuery {
    return LanguageQuery.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Languages> {
    const languagesString: string | null = await veauRedis.getString().get(REDIS_KEY);

    if (languagesString !== null) {
      const languageJSONs: Array<LanguageJSON> = JSON.parse(languagesString);
      return Languages.fromJSON(languageJSONs);
    }

    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`;

    const languageRows: Array<LanguageRow> = await veauMySQL.execute<Array<LanguageRow>>(query);
    const languages: Languages = Languages.fromRow(languageRows);

    await languageCommand.insertAll(languages);

    return languages;
  }

  public async findByISO639(iso639: ISO639): Promise<Language> {
    const languages: Languages = await this.all();
    const found: Language | undefined = languages.find((language: Language): boolean => {
      if (language.getISO639().equals(iso639)) {
        return true;
      }

      return false;
    });

    if (found === undefined) {
      throw new NoSuchElementError(iso639.toString());
    }

    return found;
  }
}
