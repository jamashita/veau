import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ISO639 } from '../veau-vo/ISO639';
import { Language, LanguageRow } from '../veau-vo/Language';
import { LanguageID } from '../veau-vo/LanguageID';
import { ILanguageQuery } from './interfaces/ILanguageQuery';

export class LanguageRedisQuery implements ILanguageQuery {
  private key: string;

  public static getInstance(key: string): LanguageRedisQuery {
    return new LanguageRedisQuery(key);
  }

  private constructor(key: string) {
    this.key = key;
  }

  public async allLanguages(): Promise<Array<Language>> {
    const languagesString: string | null = await VeauRedis.getString().get(this.key);

    if (languagesString) {
      const languageRows: Array<LanguageRow> = JSON.parse(languagesString);
      return languageRows.map<Language>((row: LanguageRow) => {
        const {
          languageID,
          name,
          englishName,
          iso639
        } = row;

        return Language.of(LanguageID.of(languageID), name, englishName, ISO639.of(iso639));
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
      throw new NoSuchElementError(iso639.get());
    }

    return found;
  }
}
