import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { LanguageError } from './Error/LanguageError';
import { LanguageIDError } from './Error/LanguageIDError';
import { ISO639 } from './ISO639';
import { LanguageID } from './LanguageID';
import { LanguageName } from './LanguageName';

export type LanguageJSON = Readonly<{
  languageID: string;
  name: string;
  englishName: string;
  iso639: string;
}>;
export type LanguageRow = Readonly<{
  languageID: string;
  name: string;
  englishName: string;
  iso639: string;
}>;

export class Language extends ValueObject<Language, 'Language'> implements JSONable<LanguageJSON> {
  public readonly noun: 'Language' = 'Language';
  private readonly languageID: LanguageID;
  private readonly name: LanguageName;
  private readonly englishName: LanguageName;
  private readonly iso639: ISO639;

  private static readonly EMPTY: Language = new Language(
    LanguageID.empty(),
    LanguageName.empty(),
    LanguageName.empty(),
    ISO639.empty()
  );

  public static of(languageID: LanguageID, name: LanguageName, englishName: LanguageName, iso639: ISO639): Language {
    if (languageID.isEmpty()) {
      return Language.empty();
    }
    if (name.isEmpty()) {
      return Language.empty();
    }
    if (englishName.isEmpty()) {
      return Language.empty();
    }
    if (iso639.isEmpty()) {
      return Language.empty();
    }

    return new Language(languageID, name, englishName, iso639);
  }

  public static ofJSON(json: LanguageJSON): Superposition<Language, LanguageError> {
    return LanguageID.ofString(json.languageID).transform<Language, LanguageError>(
      (languageID: LanguageID) => {
        return Language.of(
          languageID,
          LanguageName.of(json.name),
          LanguageName.of(json.englishName),
          ISO639.of(json.iso639)
        );
      },
      (err: LanguageIDError) => {
        throw new LanguageError('Language.ofJSON()', err);
      },
      LanguageError
    );
  }

  public static ofRow(row: LanguageRow): Superposition<Language, LanguageError> {
    return LanguageID.ofString(row.languageID).transform<Language, LanguageError>(
      (languageID: LanguageID) => {
        return Language.of(
          languageID,
          LanguageName.of(row.name),
          LanguageName.of(row.englishName),
          ISO639.of(row.iso639)
        );
      },
      (err: LanguageIDError) => {
        throw new LanguageError('Language.ofRow()', err);
      },
      LanguageError
    );
  }

  public static empty(): Language {
    return Language.EMPTY;
  }

  public static isJSON(n: unknown): n is LanguageJSON {
    if (!Kind.isObject<LanguageJSON>(n)) {
      return false;
    }
    if (!Kind.isString(n.languageID)) {
      return false;
    }
    if (!Kind.isString(n.name)) {
      return false;
    }
    if (!Kind.isString(n.englishName)) {
      return false;
    }
    if (!Kind.isString(n.iso639)) {
      return false;
    }

    return true;
  }

  protected constructor(languageID: LanguageID, name: LanguageName, englishName: LanguageName, iso639: ISO639) {
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

  public isEmpty(): boolean {
    if (this === Language.empty()) {
      return true;
    }

    return false;
  }

  public equals(other: Language): boolean {
    if (this === other) {
      return true;
    }
    if (!this.languageID.equals(other.languageID)) {
      return false;
    }
    if (!this.name.equals(other.name)) {
      return false;
    }
    if (!this.englishName.equals(other.englishName)) {
      return false;
    }
    if (!this.iso639.equals(other.iso639)) {
      return false;
    }

    return true;
  }

  public toJSON(): LanguageJSON {
    return {
      languageID: this.languageID.get().get(),
      name: this.name.get(),
      englishName: this.englishName.get(),
      iso639: this.iso639.get()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.languageID.toString());
    properties.push(this.name.toString());
    properties.push(this.englishName.toString());
    properties.push(this.iso639.toString());

    return properties.join(' ');
  }
}
