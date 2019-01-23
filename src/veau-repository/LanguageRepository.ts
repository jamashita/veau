import { NoSuchElementError } from '../veau-general/NoSuchElementError';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO639 } from '../veau-vo/ISO639';
import { Language, LanguageRow } from '../veau-vo/Language';
import { LanguageID } from '../veau-vo/LanguageID';

const REDIS_KEY: string = 'Languages';

export class LanguageRepository implements ILanguageRepository {
  private static instance: LanguageRepository = new LanguageRepository();

  public static getInstance(): LanguageRepository {
    return LanguageRepository.instance;
  }

  private constructor() {
  }

  public async all(): Promise<Array<Language>> {
    const languagesString: string | null = await VeauRedis.getString().get(REDIS_KEY);

    if (languagesString) {
      const languageRows: Array<LanguageRow> = JSON.parse(languagesString);
      return languageRows.map<Language>((row: LanguageRow) => {
        return this.toLanguage(row);
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

    const languages: Array<LanguageRow> = await VeauMySQL.query(query);
    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(languages));
    return languages.map<Language>((row: LanguageRow) => {
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
    const filtered: Array<Language> = languages.filter((language: Language) => {
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

  public deleteCache(): Promise<boolean> {
    return VeauRedis.delete(REDIS_KEY);
  }
}

export interface ILanguageRepository {

  all(): Promise<Array<Language>>;

  findByISO639(iso639: ISO639): Promise<Language>;

  deleteCache(): Promise<boolean>;
}
