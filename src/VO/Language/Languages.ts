import { Collection, ImmutableProject, Project } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { Absent, Alive, Dead, Present, Quantum, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { Objet } from '@jamashita/publikum-object';
import { Mapper, Predicate } from '@jamashita/publikum-type';

import { LanguageError } from './Error/LanguageError';
import { LanguagesError } from './Error/LanguagesError';
import { Language, LanguageJSON, LanguageRow } from './Language';
import { LanguageID } from './LanguageID';

export class Languages extends Objet implements Collection<LanguageID, Language>, JSONable {
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
    return Schrodinger.all<Language, LanguageError>(superpositions).match<Languages, LanguagesError>(
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

  protected constructor(languages: Project<LanguageID, Language>) {
    super();
    this.languages = languages;
  }

  public get(key: LanguageID): Quantum<Language> {
    return this.languages.get(key);
  }

  public contains(value: Language): boolean {
    return this.languages.contains(value);
  }

  public size(): number {
    return this.languages.size();
  }

  public map<U>(mapper: Mapper<Language, U>): Array<U> {
    const array: Array<U> = [];
    let i: number = 0;

    this.languages.forEach((language: Language) => {
      array.push(mapper(language, i));
      i++;
    });

    return array;
  }

  public find(predicate: Predicate<Language>): Quantum<Language> {
    for (const language of this.languages.toMap().values()) {
      if (predicate(language)) {
        return Present.of<Language>(language);
      }
    }

    return Absent.of<Language>();
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
