import { Language, LanguageRow } from '@/veau-entity/Language';
import { NoSuchElementError } from '@/veau-error/NoSuchElementError';
import { LanguageFactory } from '@/veau-factory/LanguageFactory';
import { VeauRedis } from '@/veau-infrastructure/VeauRedis';
import { ISO639 } from '@/veau-vo/ISO639';
import { ILanguageQuery } from './interfaces/ILanguageQuery';

export class LanguageRedisQuery implements ILanguageQuery {
  private static instance: LanguageRedisQuery = new LanguageRedisQuery();
  private static languageFactory: LanguageFactory = LanguageFactory.getInstance();
  private static LANGUAGES_REDIS_KEY: string = 'LANGUAGES';

  public static getInstance(): LanguageRedisQuery {
    return LanguageRedisQuery.instance;
  }

  private constructor() {
  }

  public async allLanguages(): Promise<Array<Language>> {
    const languagesString: string | null = await VeauRedis.getString().get(LanguageRedisQuery.LANGUAGES_REDIS_KEY);

    if (languagesString) {
      const languageRows: Array<LanguageRow> = JSON.parse(languagesString);
      return languageRows.map<Language>((row: LanguageRow) => {
        return LanguageRedisQuery.languageFactory.fromRow(row);
      });
    }

    return [];
  }

  public async findByISO639(iso639: ISO639): Promise<Language> {
    const languages: Array<Language> = await this.allLanguages();
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
