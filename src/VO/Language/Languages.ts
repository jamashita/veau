import { CancellableEnumerator, ImmutableProject, Pair, Project, Quantity } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { Mapper, Nullable, Predicate } from '@jamashita/publikum-type';

import { LanguageError } from './Error/LanguageError';
import { LanguagesError } from './Error/LanguagesError';
import { Language, LanguageJSON, LanguageRow } from './Language';
import { LanguageID } from './LanguageID';

export class Languages extends Quantity<Languages, LanguageID, Language, 'Languages'>
  implements JSONable<Array<LanguageJSON>> {
  public readonly noun: 'Languages' = 'Languages';
  private readonly languages: Project<LanguageID, Language>;

  private static readonly EMPTY: Languages = new Languages(ImmutableProject.empty<LanguageID, Language>());

  public static of(languages: Project<LanguageID, Language>): Languages {
    if (languages.isEmpty()) {
      return Languages.empty();
    }

    return new Languages(languages);
  }

  private static ofMap(languages: Map<LanguageID, Language>): Languages {
    return Languages.of(ImmutableProject.of<LanguageID, Language>(languages));
  }

  public static ofArray(languages: Array<Language>): Languages {
    const map: Map<LanguageID, Language> = new Map<LanguageID, Language>();

    languages.forEach((language: Language) => {
      map.set(language.getLanguageID(), language);
    });

    return Languages.ofMap(map);
  }

  public static ofSpread(...languages: Array<Language>): Languages {
    return Languages.ofArray(languages);
  }

  public static ofSuperposition(
    superpositions: Array<Superposition<Language, LanguageError>>
  ): Superposition<Languages, LanguagesError> {
    return Superposition.all<Language, LanguageError>(superpositions, LanguageError).transform<
      Languages,
      LanguagesError
    >(
      (regions: Array<Language>) => {
        return Languages.ofArray(regions);
      },
      (err: LanguageError) => {
        throw new LanguagesError('Languages.ofSuperposition()', err);
      },
      LanguagesError
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

  protected constructor(languages: Project<LanguageID, Language>) {
    super();
    this.languages = languages;
  }

  public get(key: LanguageID): Nullable<Language> {
    return this.languages.get(key);
  }

  public contains(value: Language): boolean {
    return this.languages.contains(value);
  }

  public size(): number {
    return this.languages.size();
  }

  public forEach(iteration: CancellableEnumerator<LanguageID, Language>): void {
    this.languages.forEach(iteration);
  }

  public map<U>(mapper: Mapper<Language, U>): Array<U> {
    const array: Array<U> = [];
    let i: number = 0;

    this.forEach((language: Language) => {
      array.push(mapper(language, i));
      i++;
    });

    return array;
  }

  public find(predicate: Predicate<Language>): Nullable<Language> {
    for (const language of this.languages.toMap().values()) {
      if (predicate(language)) {
        return language;
      }
    }

    return null;
  }

  public iterator(): Iterator<Pair<LanguageID, Language>> {
    return this.languages.iterator();
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
    const json: Array<LanguageJSON> = [];

    this.languages.forEach((language: Language) => {
      json.push(language.toJSON());
    });

    return json;
  }

  public serialize(): string {
    return this.languages.toString();
  }
}
