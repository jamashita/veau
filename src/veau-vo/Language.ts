import {ISO639} from './ISO639';
import {ValueObject} from './ValueObject';

export type LanguageJSON = {
  name: string;
  englishName: string;
  iso639: string;
};

export class Language extends ValueObject {
  private name: string;
  private englishName: string;
  private iso639: ISO639;

  public constructor(name: string, englishName: string, iso639: ISO639) {
    super();
    this.name = name;
    this.englishName = englishName;
    this.iso639 = iso639;
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
    if (this.iso639.equals(other.getISO639())) {
      return true;
    }

    return false;
  }

  public toJSON(): LanguageJSON {
    const {
      name,
      englishName,
      iso639
    } = this;

    return {
      name,
      englishName,
      iso639: iso639.get()
    };
  }

  public toString(): string {
    return `${this.name} (${this.englishName})`;
  }
}
