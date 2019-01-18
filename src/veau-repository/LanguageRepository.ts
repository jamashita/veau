import {NoSuchElementError} from '../veau-general/Error';
import {VeauDB} from '../veau-infrastructure/VeauDB';
import {VeauRedis} from '../veau-infrastructure/VeauRedis';
import {ISO639} from '../veau-vo/ISO639';
import {Language, LanguageRow} from '../veau-vo/Language';
import {LanguageID} from '../veau-vo/LanguageID';

const REDIS_KEY = 'Languages';

export class LanguageRepository implements ILanguageRepository {
  private static instance: LanguageRepository = new LanguageRepository();

  public static getInstance(): LanguageRepository {
    return LanguageRepository.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Array<Language>> {
    const languagesString: string = await VeauRedis.getString().get(REDIS_KEY);

    if (languagesString) {
      const languageRows: Array<LanguageRow> = JSON.parse(languagesString);
      return languageRows.map<Language>((row) => {
        return this.toLanguage(row);
      });
    }

    const query = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1;`;

    const languageRows: Array<LanguageRow> = await VeauDB.query(query);
    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(languageRows));
    return languageRows.map<Language>((row) => {
      return this.toLanguage(row);
    });
  }

  private toLanguage(row: LanguageRow): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = row;

    return Language.of(LanguageID.of(languageID), name, englishName, ISO639.of(iso639));
  }

  public async findByISO639(iso639: ISO639): Promise<Language> {
    const languages: Array<Language> = await this.all();
    const filtered: Array<Language> = languages.filter((language) => {
      if (language.getISO639().equals(iso639)) {
        return true;
      }

      return false;
    });

    if (filtered.length === 0) {
      throw new NoSuchElementError(iso639.get());
    }

    return filtered[0];
  }
}

export interface ILanguageRepository {

  all(): Promise<Array<Language>>;
  findByISO639(iso639: ISO639): Promise<Language>;
}
