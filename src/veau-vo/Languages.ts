import { Collection } from '../veau-general/Collection/Collection';
import { Sequence } from '../veau-general/Collection/Sequence';
import { JSONable } from '../veau-general/JSONable';
import { Optional } from '../veau-general/Optional/Optional';
import { Mapper, Predicate } from '../veau-general/Type/Function';
import { Language, LanguageJSON, LanguageRow } from './Language';

export class Languages implements Collection<number, Language>, JSONable {
  public readonly noun: 'Languages' = 'Languages';
  private readonly languages: Sequence<Language>;

  private static readonly EMPTY: Languages = Languages.of(Sequence.empty<Language>());

  public static of(languages: Sequence<Language>): Languages {
    return new Languages(languages);
  }

  public static ofArray(languages: Array<Language>): Languages {
    return Languages.of(Sequence.of<Language>(languages));
  }

  public static ofSpread(...languages: Array<Language>): Languages {
    return Languages.ofArray(languages);
  }

  public static ofJSON(json: Array<LanguageJSON>): Languages {
    const languages: Array<Language> = json.map<Language>((language: LanguageJSON) => {
      return Language.ofJSON(language);
    });

    return Languages.ofArray(languages);
  }

  public static ofRow(rows: Array<LanguageRow>): Languages {
    const languages: Array<Language> = rows.map<Language>((language: LanguageJSON) => {
      return Language.ofRow(language);
    });

    return Languages.ofArray(languages);
  }

  public static empty(): Languages {
    return Languages.EMPTY;
  }

  protected constructor(languages: Sequence<Language>) {
    this.languages = languages;
  }

  public get(index: number): Optional<Language> {
    return this.languages.get(index);
  }

  public contains(value: Language): boolean {
    return this.languages.contains(value);
  }

  public size(): number {
    return this.languages.size();
  }

  public map<U>(mapper: Mapper<Language, U>): Array<U> {
    return this.languages.toArray().map<U>(mapper);
  }

  public find(predicate: Predicate<Language>): Optional<Language> {
    return this.languages.select(predicate);
  }

  public isEmpty(): boolean {
    return this.languages.isEmpty();
  }

  public equals(other: Languages): boolean {
    if (this === other) {
      return true;
    }

    return this.languages.equals(other.languages);
  }

  public toJSON(): Array<LanguageJSON> {
    return this.languages.toArray().map<LanguageJSON>((language: Language) => {
      return language.toJSON();
    });
  }

  public toString(): string {
    return this.languages.toArray().map<string>((language: Language) => {
      return language.toString();
    }).join(', ');
  }
}
