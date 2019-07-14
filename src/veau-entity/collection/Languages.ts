import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Language, LanguageJSON, LanguageRow } from '../Language';

export class Languages {
  private languages: Array<Language>;

  public static from(languages: Array<Language>): Languages {
    return new Languages(languages);
  }

  public static fromJSON(json: Array<LanguageJSON>): Languages {
    const languages: Array<Language> = json.map<Language>((language: LanguageJSON): Language => {
      return Language.fromJSON(language);
    });

    return Languages.from(languages);
  }

  public static fromRow(rows: Array<LanguageRow>): Languages {
    const languages: Array<Language> = rows.map<Language>((language: LanguageJSON): Language => {
      return Language.fromRow(language);
    });

    return Languages.from(languages);
  }

  private constructor(languages: Array<Language>) {
    this.languages = languages;
  }

  public add(language: Language): Languages {
    return new Languages([
      ...this.languages,
      language
    ]);
  }

  public get(index: number): Language {
    const language: Language | undefined = this.languages[index];

    if (language === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return language;
  }

  public length(): number {
    return this.languages.length;
  }

  public map<U>(func: (language: Language) => U): Array<U> {
    return this.languages.map<U>(func);
  }

  public find(predicate: (language: Language) => boolean): Language | undefined {
    return this.languages.find(predicate);
  }

  public equals(other: Languages): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.length();
    if (length !== other.length()) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      if (!this.get(i).equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<LanguageJSON> {
    return this.languages.map<LanguageJSON>((language: Language): LanguageJSON => {
      return language.toJSON();
    });
  }

  public toString(): string {
    return this.languages.map<string>((language: Language): string => {
      return language.toString();
    }).join(', ');
  }
}
