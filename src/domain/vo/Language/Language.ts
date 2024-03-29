import { ValueObject } from '@jamashita/anden-object';
import { JSONable, Kind } from '@jamashita/anden-type';
import { ISO639 } from './ISO639.js';
import { LanguageID } from './LanguageID.js';
import { LanguageName } from './LanguageName.js';

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

export class Language extends ValueObject<'Language'> implements JSONable<LanguageJSON> {
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

  public static empty(): Language {
    return Language.EMPTY;
  }

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

  public static ofJSON(json: LanguageJSON): Language {
    return Language.of(
      LanguageID.ofString(json.languageID),
      LanguageName.of(json.name),
      LanguageName.of(json.englishName),
      ISO639.of(json.iso639)
    );
  }

  public static ofRow(row: LanguageRow): Language {
    return Language.of(
      LanguageID.ofString(row.languageID),
      LanguageName.of(row.name),
      LanguageName.of(row.englishName),
      ISO639.of(row.iso639)
    );
  }

  public static validate(n: unknown): n is LanguageJSON {
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

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Language)) {
      return false;
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

  public serialize(): string {
    const props: Array<string> = [];

    props.push(this.languageID.toString());
    props.push(this.name.toString());
    props.push(this.englishName.toString());
    props.push(this.iso639.toString());

    return props.join(' ');
  }

  public toJSON(): LanguageJSON {
    return {
      languageID: this.languageID.get().get(),
      name: this.name.get(),
      englishName: this.englishName.get(),
      iso639: this.iso639.get()
    };
  }

  public getEnglishName(): LanguageName {
    return this.englishName;
  }

  public getISO639(): ISO639 {
    return this.iso639;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getName(): LanguageName {
    return this.name;
  }

  public isEmpty(): boolean {
    return this === Language.empty();
  }
}
