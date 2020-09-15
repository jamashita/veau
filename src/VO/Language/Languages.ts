import { CancellableEnumerator, ImmutableProject, Pair, Project, Quantity } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper, Nullable, Predicate } from '@jamashita/publikum-type';
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

  public static ofArray(languages: Array<Language>): Languages {
    const map: Map<LanguageID, Language> = new Map<LanguageID, Language>();

    languages.forEach((language: Language) => {
      map.set(language.getLanguageID(), language);
    });

    return Languages.ofMap(map);
  }

  public static ofSpread(...languages: ReadonlyArray<Language>): Languages {
    return Languages.ofArray([...languages]);
  }

  public static ofJSON(json: Array<LanguageJSON>): Languages {
    const arr: Array<Language> = json.map<Language>((language: LanguageJSON) => {
      return Language.ofJSON(language);
    });

    return Languages.ofArray(arr);
  }

  public static ofRow(rows: Array<LanguageRow>): Languages {
    const arr: Array<Language> = rows.map<Language>((language: LanguageRow) => {
      return Language.ofJSON(language);
    });

    return Languages.ofArray(arr);
  }

  public static empty(): Languages {
    return Languages.EMPTY;
  }

  private static ofMap(languages: Map<LanguageID, Language>): Languages {
    return Languages.of(ImmutableProject.of<LanguageID, Language>(languages));
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

  public [Symbol.iterator](): Iterator<Pair<LanguageID, Language>> {
    return this.languages[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<Language, LanguageID>): boolean {
    return this.languages.every(predicate);
  }

  public some(predicate: BinaryPredicate<Language, LanguageID>): boolean {
    return this.languages.some(predicate);
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
}
