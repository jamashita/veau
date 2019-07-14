import { ISO639 } from '../veau-vo/ISO639';
import { LanguageID } from '../veau-vo/LanguageID';
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
  private name: string;
  private englishName: string;
  private iso639: ISO639;

  public static from(languageID: LanguageID, name: string, englishName: string, iso639: ISO639): Language {
    return new Language(languageID, name, englishName, iso639);
  }

  public static fromJSON(json: LanguageJSON): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = json;

    return Language.from(LanguageID.of(languageID), name, englishName, ISO639.of(iso639));
  }

  public static fromRow(row: LanguageRow): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = row;

    return Language.from(LanguageID.of(languageID), name, englishName, ISO639.of(iso639));
  }

  public static default(): Language {
    return Language.from(LanguageID.of(0), '', '', ISO639.default());
  }

  private constructor(languageID: LanguageID, name: string, englishName: string, iso639: ISO639) {
    super();
    this.languageID = languageID;
    this.name = name;
    this.englishName = englishName;
    this.iso639 = iso639;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getName(): string {
    return this.name;
  }

  public getEnglishName(): string {
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
      name,
      englishName,
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

    return `${languageID.toString()} ${name} ${englishName} ${iso639.toString()}`;
  }
}
