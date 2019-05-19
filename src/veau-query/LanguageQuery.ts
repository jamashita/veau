import { LanguageCommand } from '../veau-command/LanguageCommand';
import { Language, LanguageJSON, LanguageRow } from '../veau-entity/Language';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { LanguageFactory } from '../veau-factory/LanguageFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO639 } from '../veau-vo/ISO639';

const languageFactory: LanguageFactory = LanguageFactory.getInstance();
const languageCommand: LanguageCommand = LanguageCommand.getInstance();

const REDIS_KEY: string = 'LANGUAGES';

export class LanguageQuery {
  private static instance: LanguageQuery = new LanguageQuery();

  public static getInstance(): LanguageQuery {
    return LanguageQuery.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Array<Language>> {
    const languagesString: string | null = await VeauRedis.getString().get(REDIS_KEY);

    if (languagesString !== null) {
      const languageJSONs: Array<LanguageJSON> = JSON.parse(languagesString);
      return languageJSONs.map<Language>((json: LanguageJSON) => {
        return languageFactory.fromJSON(json);
      });
    }

    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`;

    const languageRows: Array<LanguageRow> = await VeauMySQL.execute(query);
    const languages: Array<Language> = languageRows.map<Language>((row: LanguageRow) => {
      return languageFactory.fromRow(row);
    });

    await languageCommand.insertAll(languages);

    return languages;
  }

  public async findByISO639(iso639: ISO639): Promise<Language> {
    const languages: Array<Language> = await this.all();
    const found: Language | undefined = languages.find((language: Language) => {
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
