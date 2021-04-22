import { BinaryPredicate, Enumerator, JSONable, Kind, Mapper, Nullable } from '@jamashita/anden-type';
import { Collection, ImmutableProject, Project, Quantity } from '@jamashita/lluvia-collection';
import { Language, LanguageJSON, LanguageRow } from './Language';
import { LanguageID } from './LanguageID';

export class Languages extends Quantity<LanguageID, Language, 'Languages'>
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

  public static ofArray(languages: ReadonlyArray<Language>): Languages {
    const map: Map<LanguageID, Language> = new Map<LanguageID, Language>();

    languages.forEach((language: Language) => {
      map.set(language.getLanguageID(), language);
    });

    return Languages.ofMap(map);
  }

  public static ofSpread(...languages: Array<Language>): Languages {
    return Languages.ofArray(languages);
  }

  public static ofJSON(json: ReadonlyArray<LanguageJSON>): Languages {
    const arr: Array<Language> = json.map<Language>((language: LanguageJSON) => {
      return Language.ofJSON(language);
    });

    return Languages.ofArray(arr);
  }

  public static ofRow(rows: ReadonlyArray<LanguageRow>): Languages {
    const arr: Array<Language> = rows.map<Language>((language: LanguageRow) => {
      return Language.ofJSON(language);
    });

    return Languages.ofArray(arr);
  }

  public static empty(): Languages {
    return Languages.EMPTY;
  }

  public static validate(n: unknown): n is ReadonlyArray<LanguageJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return Language.validate(o);
    });
  }

  private static ofMap(languages: ReadonlyMap<LanguageID, Language>): Languages {
    return Languages.of(ImmutableProject.ofMap<LanguageID, Language>(languages));
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

  public forEach(iteration: Enumerator<LanguageID, Language>): void {
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

  public iterator(): Iterator<[LanguageID, Language]> {
    return this.languages.iterator();
  }

  public every(predicate: BinaryPredicate<Language, LanguageID>): boolean {
    return this.languages.every(predicate);
  }

  public some(predicate: BinaryPredicate<Language, LanguageID>): boolean {
    return this.languages.some(predicate);
  }

  public values(): Iterable<Language> {
    return this.languages.values();
  }

  public filter(predicate: BinaryPredicate<Language, LanguageID>): Collection<LanguageID, Language> {
    return this.languages.filter(predicate);
  }

  public find(predicate: BinaryPredicate<Language, LanguageID>): Nullable<Language> {
    return this.languages.find(predicate);
  }

  public map<W>(mapper: Mapper<Language, W>): Collection<LanguageID, W> {
    return this.languages.map<W>(mapper);
  }
}
