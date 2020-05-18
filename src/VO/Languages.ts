import {
  Alive,
  Collection,
  Dead,
  ImmutableSequence,
  JSONable,
  manoeuvre,
  Mapper,
  Objet,
  Predicate,
  Quantum,
  Sequence,
  Superposition
} from 'publikum';
import { LanguageError } from '../Error/LanguageError';
import { LanguagesError } from '../Error/LanguagesError';
import { Language, LanguageJSON, LanguageRow } from './Language';

export class Languages extends Objet implements Collection<number, Language>, JSONable {
  public readonly noun: 'Languages' = 'Languages';
  private readonly languages: Sequence<Language>;

  private static readonly EMPTY: Languages = new Languages(ImmutableSequence.empty<Language>());

  public static of(languages: Sequence<Language>): Languages {
    if (languages.isEmpty()) {
      return Languages.empty();
    }

    return new Languages(languages);
  }

  public static ofArray(languages: Array<Language>): Languages {
    return Languages.of(ImmutableSequence.of<Language>(languages));
  }

  public static ofSpread(...languages: Array<Language>): Languages {
    return Languages.ofArray(languages);
  }

  public static ofSuperposition(
    superpositions: Array<Superposition<Language, LanguageError>>
  ): Superposition<Languages, LanguagesError> {
    return manoeuvre<Language, LanguageError>(superpositions).match<Languages, LanguagesError>(
      (regions: Array<Language>) => {
        return Alive.of<Languages, LanguagesError>(Languages.ofArray(regions));
      },
      (err: LanguageError) => {
        return Dead.of<Languages, LanguagesError>(new LanguagesError('Languages.ofSuperposition()', err));
      }
    );
  }

  public static ofJSON(json: Array<LanguageJSON>): Superposition<Languages, LanguagesError> {
    const superpositions: Array<Superposition<Language, LanguageError>> = json.map<
      Superposition<Language, LanguageError>
    >((language: LanguageJSON) => {
      return Language.ofJSON(language);
    });

    return Languages.ofSuperposition(superpositions);
  }

  public static ofRow(rows: Array<LanguageRow>): Superposition<Languages, LanguagesError> {
    const superpositions: Array<Superposition<Language, LanguageError>> = rows.map<
      Superposition<Language, LanguageError>
    >((language: LanguageJSON) => {
      return Language.ofRow(language);
    });

    return Languages.ofSuperposition(superpositions);
  }

  public static empty(): Languages {
    return Languages.EMPTY;
  }

  protected constructor(languages: Sequence<Language>) {
    super();
    this.languages = languages;
  }

  public get(index: number): Quantum<Language> {
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

  public find(predicate: Predicate<Language>): Quantum<Language> {
    return this.languages.find(predicate);
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

  public serialize(): string {
    return this.languages.toString();
  }
}
