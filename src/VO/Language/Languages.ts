import { BinaryPredicate, Catalogue, JSONable, Kind, Mapper, Nullable } from '@jamashita/anden-type';
import { ImmutableProject, Quantity, ReadonlyProject } from '@jamashita/lluvia-collection';
import { Language, LanguageJSON, LanguageRow } from './Language';
import { LanguageID } from './LanguageID';

export class Languages extends Quantity<LanguageID, Language, 'Languages'> implements JSONable<Array<LanguageJSON>> {
  public readonly noun: 'Languages' = 'Languages';
  private readonly languages: ImmutableProject<LanguageID, Language>;

  private static readonly EMPTY: Languages = new Languages(ImmutableProject.empty<LanguageID, Language>());

  public static empty(): Languages {
    return Languages.EMPTY;
  }

  public static of(languages: ReadonlyProject<LanguageID, Language>): Languages {
    if (languages.isEmpty()) {
      return Languages.empty();
    }

    return new Languages(ImmutableProject.of<LanguageID, Language>(languages));
  }

  public static ofArray(languages: ReadonlyArray<Language>): Languages {
    const map: Map<LanguageID, Language> = new Map<LanguageID, Language>();

    languages.forEach((language: Language) => {
      map.set(language.getLanguageID(), language);
    });

    return Languages.ofMap(map);
  }

  public static ofJSON(json: ReadonlyArray<LanguageJSON>): Languages {
    const arr: Array<Language> = json.map<Language>((language: LanguageJSON) => {
      return Language.ofJSON(language);
    });

    return Languages.ofArray(arr);
  }

  private static ofMap(languages: ReadonlyMap<LanguageID, Language>): Languages {
    return Languages.of(ImmutableProject.ofMap<LanguageID, Language>(languages));
  }

  public static ofRow(rows: ReadonlyArray<LanguageRow>): Languages {
    const arr: Array<Language> = rows.map<Language>((language: LanguageRow) => {
      return Language.ofRow(language);
    });

    return Languages.ofArray(arr);
  }

  public static ofSpread(...languages: Array<Language>): Languages {
    return Languages.ofArray(languages);
  }

  public static validate(n: unknown): n is ReadonlyArray<LanguageJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return Language.validate(o);
    });
  }

  protected constructor(languages: ImmutableProject<LanguageID, Language>) {
    super();
    this.languages = languages;
  }

  public contains(value: Language): boolean {
    return this.languages.contains(value);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Languages)) {
      return false;
    }

    return this.languages.equals(other.languages);
  }

  public every(predicate: BinaryPredicate<Language, LanguageID>): boolean {
    return this.languages.every(predicate);
  }

  public filter(predicate: BinaryPredicate<Language, LanguageID>): Languages {
    return Languages.of(this.languages.filter(predicate));
  }

  public find(predicate: BinaryPredicate<Language, LanguageID>): Nullable<Language> {
    return this.languages.find(predicate);
  }

  public forEach(catalogue: Catalogue<LanguageID, Language>): void {
    this.languages.forEach(catalogue);
  }

  public get(key: LanguageID): Nullable<Language> {
    return this.languages.get(key);
  }

  public isEmpty(): boolean {
    return this.languages.isEmpty();
  }

  public iterator(): Iterator<[LanguageID, Language]> {
    return this.languages.iterator();
  }

  public map<W>(mapper: Mapper<Language, W>): ImmutableProject<LanguageID, W> {
    return this.languages.map<W>(mapper);
  }

  public serialize(): string {
    return this.languages.toString();
  }

  public size(): number {
    return this.languages.size();
  }

  public some(predicate: BinaryPredicate<Language, LanguageID>): boolean {
    return this.languages.some(predicate);
  }

  public toJSON(): Array<LanguageJSON> {
    const json: Array<LanguageJSON> = [];

    this.languages.forEach((language: Language) => {
      json.push(language.toJSON());
    });

    return json;
  }

  public values(): Iterable<Language> {
    return this.languages.values();
  }
}
