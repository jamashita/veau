import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { ISO639 } from '../veau-vo/ISO639';
import { Language, LanguageRow } from '../veau-vo/Language';
import { LanguageID } from '../veau-vo/LanguageID';
import { ILanguageQuery } from './interfaces/ILanguageQuery';

export class LanguageMySQLQuery implements ILanguageQuery {

  public static getInstance(): LanguageMySQLQuery {
    return new LanguageMySQLQuery();
  }

  private constructor() {
  }

  public async allLanguages(): Promise<Array<Language>> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`;

    const languages: Array<LanguageRow> = await VeauMySQL.query(query);
    return languages.map<Language>((row: LanguageRow) => {
      const {
        languageID,
        name,
        englishName,
        iso639
      } = row;

      return Language.of(LanguageID.of(languageID), name, englishName, ISO639.of(iso639));
    });
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
