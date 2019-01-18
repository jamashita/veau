import {ISO639} from './ISO639';
import {LanguageID} from './LanguageID';
import {ValueObject} from './ValueObject';

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

export class Language extends ValueObject {
  private languageID: LanguageID;
  private name: string;
  private englishName: string;
  private iso639: ISO639;

  public static of(languageID: LanguageID, name: string, englishName: string, iso639: ISO639): Language {
    return new Language(languageID, name, englishName, iso639);
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

  public equals(other: Language): boolean {
    if (this === other) {
      return true;
    }
    if (this.languageID.equals(other.getLanguageID())) {
      return true;
    }

    return false;
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
    return `${this.name} (${this.englishName})`;
  }
}
