import { Language, LanguageJSON, LanguageRow } from '@/veau-entity/Language';
import { ISO639 } from '@/veau-vo/ISO639';
import { LanguageID } from '@/veau-vo/LanguageID';

export class LanguageFactory {
  private static instance: LanguageFactory = new LanguageFactory();

  public static getInstance(): LanguageFactory {
    return LanguageFactory.instance;
  }

  private constructor() {
  }

  public from(languageID: LanguageID, name: string, englishName: string, iso639: ISO639): Language {
    return new Language(languageID, name, englishName, iso639);
  }

  public fromJSON(json: LanguageJSON): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = json;

    return this.from(LanguageID.of(languageID), name, englishName, ISO639.of(iso639));
  }

  public fromRow(row: LanguageRow): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = row;

    return this.from(LanguageID.of(languageID), name, englishName, ISO639.of(iso639));
  }
}
