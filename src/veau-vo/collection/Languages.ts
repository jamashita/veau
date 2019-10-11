import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { JSONable } from '../../veau-general/JSONable';
import { Mapper } from '../../veau-general/Type/Mapper';
import { Predicate } from '../../veau-general/Type/Predicate';
import { Language, LanguageJSON, LanguageRow } from '../Language';

export class Languages implements JSONable {
  private languages: Array<Language>;

  public static of(languages: Array<Language>): Languages {
    return new Languages(languages);
  }

  public static ofJSON(json: Array<LanguageJSON>): Languages {
    const languages: Array<Language> = json.map<Language>((language: LanguageJSON): Language => {
      return Language.ofJSON(language);
    });

    return Languages.of(languages);
  }

  public static ofRow(rows: Array<LanguageRow>): Languages {
    const languages: Array<Language> = rows.map<Language>((language: LanguageJSON): Language => {
      return Language.ofRow(language);
    });

    return Languages.of(languages);
  }

  public static default(): Languages {
    return Languages.of([]);
  }

  private constructor(languages: Array<Language>) {
    this.languages = languages;
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

  public map<U>(mapper: Mapper<Language, U>): Array<U> {
    return this.languages.map<U>(mapper);
  }

  public find(predicate: Predicate<Language>): Language | undefined {
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
    for (let i: number = 0; i < length; i++) {
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
