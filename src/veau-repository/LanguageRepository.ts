import {NoSuchElementError} from '../veau-general/Error';
import {VeauDB} from '../veau-infrastructure/VeauDB';
import {VeauRedis} from '../veau-infrastructure/VeauRedis';
import {ISO639} from '../veau-vo/ISO639';
import {Language, LanguageJSON} from '../veau-vo/Language';

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
      const languageJSONSs: Array<LanguageJSON> = JSON.parse(languagesString);
      return languageJSONSs.map<Language>((json) => {
        return this.toLanguage(json);
      });
    }

    const query = `SELECT
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM langauges R1;`;

    const languageJSONs: Array<LanguageJSON> = await VeauDB.query(query);
    await VeauRedis.getString().set(REDIS_KEY, JSON.stringify(languageJSONs));
    return languageJSONs.map<Language>((json) => {
      return this.toLanguage(json);
    });
  }

  private toLanguage(json: LanguageJSON): Language {
    const {
      name,
      englishName,
      iso639
    } = json;

    return new Language(name, englishName, new ISO639(iso639));
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
