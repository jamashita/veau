import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Language, LanguageJSON } from '../Language';

export class Languages {
  private langauges: Array<Language>;

  public static from(languages: Array<Language>): Languages {
    return new Languages(languages);
  }

  private constructor(languages: Array<Language>) {
    this.langauges = languages;
  }

  public add(language: Language): Languages {
    return new Languages([
      ...this.langauges,
      language
    ]);
  }

  public get(index: number): Language {
    const language: Language | undefined = this.langauges[index];

    if (language === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return language;
  }

  public length(): number {
    return this.langauges.length;
  }

  public map<U>(func: (language: Language) => U): Array<U> {
    return this.langauges.map<U>(func);
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
    return this.langauges.map<LanguageJSON>((language: Language): LanguageJSON => {
      return language.toJSON();
    });
  }

  public toString(): string {
    return this.langauges.map<string>((language: Language): string => {
      return language.toString();
    }).join(', ');
  }
}
