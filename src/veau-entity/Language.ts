import { ISO639 } from '../veau-vo/ISO639';
import { LanguageID } from '../veau-vo/LanguageID';
import { LanguageName } from '../veau-vo/LanguageName';
import { Entity } from './Entity';

export type LanguageJSON = {
  languageID: number;
  name: string;
  englishName: string;
  iso639: string;
};

export type LanguageRow = {
  languageID: number;
  name: string;
  englishName: string;
  iso639: string;
};

export class Language extends Entity<LanguageID> {
  private languageID: LanguageID;
  private name: LanguageName;
  private englishName: LanguageName;
  private iso639: ISO639;

  public static from(languageID: LanguageID, name: LanguageName, englishName: LanguageName, iso639: ISO639): Language {
    return new Language(languageID, name, englishName, iso639);
  }

  public static fromJSON(json: LanguageJSON): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = json;

    return Language.from(LanguageID.of(languageID), LanguageName.of(name), LanguageName.of(englishName), ISO639.of(iso639));
  }

  public static fromRow(row: LanguageRow): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = row;

    return Language.from(LanguageID.of(languageID), LanguageName.of(name), LanguageName.of(englishName), ISO639.of(iso639));
  }

  public static default(): Language {
    return Language.from(LanguageID.default(), LanguageName.default(), LanguageName.default(), ISO639.default());
  }

  private constructor(languageID: LanguageID, name: LanguageName, englishName: LanguageName, iso639: ISO639) {
    super();
    this.languageID = languageID;
    this.name = name;
    this.englishName = englishName;
    this.iso639 = iso639;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getName(): LanguageName {
    return this.name;
  }

  public getEnglishName(): LanguageName {
    return this.englishName;
  }

  public getISO639(): ISO639 {
    return this.iso639;
  }

  public getIdentifier(): LanguageID {
    return this.languageID;
  }

  public copy(): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = this;

    return new Language(languageID, name, englishName, iso639);
  }

  public toJSON(): LanguageJSON {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = this;

    return {
      languageID: languageID.get(),
      name: name.get(),
      englishName: englishName.get(),
      iso639: iso639.get()
    };
  }

  public toString(): string {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = this;

    return `${languageID.toString()} ${name.toString()} ${englishName.toString()} ${iso639.toString()}`;
  }
}
