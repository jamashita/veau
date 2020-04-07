import { JSONable } from '../veau-general/JSONable';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';
import { ISO639 } from './ISO639';
import { LanguageID } from './LanguageID';
import { LanguageName } from './LanguageName';

export type LanguageJSON = Readonly<{
  languageID: number;
  name: string;
  englishName: string;
  iso639: string;
}>;
export type LanguageRow = Readonly<{
  languageID: number;
  name: string;
  englishName: string;
  iso639: string;
}>;

export class Language extends ValueObject implements JSONable {
  public readonly noun: 'Language' = 'Language';
  private readonly languageID: LanguageID;
  private readonly name: LanguageName;
  private readonly englishName: LanguageName;
  private readonly iso639: ISO639;

  public static of(languageID: LanguageID, name: LanguageName, englishName: LanguageName, iso639: ISO639): Language {
    return new Language(languageID, name, englishName, iso639);
  }

  public static ofJSON(json: LanguageJSON): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = json;

    return Language.of(LanguageID.of(languageID), LanguageName.of(name), LanguageName.of(englishName), ISO639.of(iso639));
  }

  public static ofRow(row: LanguageRow): Language {
    const {
      languageID,
      name,
      englishName,
      iso639
    } = row;

    return Language.of(LanguageID.of(languageID), LanguageName.of(name), LanguageName.of(englishName), ISO639.of(iso639));
  }

  public static default(): Language {
    return Language.of(LanguageID.default(), LanguageName.default(), LanguageName.default(), ISO639.default());
  }

  public static isJSON(n: unknown): n is LanguageJSON {
    if (!Type.isPlainObject(n)) {
      return false;
    }

    const {
      languageID,
      name,
      englishName,
      iso639
    } = n;

    if (!Type.isInteger(languageID)) {
      return false;
    }
    if (!Type.isString(name)) {
      return false;
    }
    if (!Type.isString(englishName)) {
      return false;
    }
    if (!Type.isString(iso639)) {
      return false;
    }

    return true;
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

  public equals(other: Language): boolean {
    if (this === other) {
      return true;
    }

    const {
      languageID,
      name,
      englishName,
      iso639
    } = this;

    if (!languageID.equals(other.getLanguageID())) {
      return false;
    }
    if (!name.equals(other.getName())) {
      return false;
    }
    if (!englishName.equals(other.getEnglishName())) {
      return false;
    }
    if (!iso639.equals(other.getISO639())) {
      return false;
    }

    return true;
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
