import { BinaryPredicate, Cloneable, Enumerator, JSONable, Kind, Mapper, Nullable } from '@jamashita/anden-type';
import { Collection, ImmutableProject, Quantity, ReadonlyProject } from '@jamashita/lluvia-collection';
import { StatsID } from './StatsID';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from './StatsOutline';

export class StatsOutlines extends Quantity<StatsID, StatsOutline, 'StatsOutlines'>
  implements Cloneable<StatsOutlines>, JSONable<Array<StatsOutlineJSON>> {
  public readonly noun: 'StatsOutlines' = 'StatsOutlines';
  private readonly outlines: ImmutableProject<StatsID, StatsOutline>;

  private static readonly EMPTY: StatsOutlines = new StatsOutlines(ImmutableProject.empty<StatsID, StatsOutline>());

  public static of(outlines: ReadonlyProject<StatsID, StatsOutline>): StatsOutlines {
    if (outlines.isEmpty()) {
      return StatsOutlines.empty();
    }

    return new StatsOutlines(ImmutableProject.of<StatsID, StatsOutline>(outlines));
  }

  public static ofArray(outlines: ReadonlyArray<StatsOutline>): StatsOutlines {
    const map: Map<StatsID, StatsOutline> = new Map<StatsID, StatsOutline>();

    outlines.forEach((outline: StatsOutline) => {
      map.set(outline.getStatsID(), outline);
    });

    return StatsOutlines.ofMap(map);
  }

  public static ofSpread(...outlines: ReadonlyArray<StatsOutline>): StatsOutlines {
    return StatsOutlines.ofArray(outlines);
  }

  public static ofJSON(json: ReadonlyArray<StatsOutlineJSON>): StatsOutlines {
    const arr: Array<StatsOutline> = json.map<StatsOutline>((outline: StatsOutlineJSON) => {
      return StatsOutline.ofJSON(outline);
    });

    return StatsOutlines.ofArray(arr);
  }

  public static ofRow(rows: ReadonlyArray<StatsOutlineRow>): StatsOutlines {
    const arr: Array<StatsOutline> = rows.map<StatsOutline>((outline: StatsOutlineJSON) => {
      return StatsOutline.ofRow(outline);
    });

    return StatsOutlines.ofArray(arr);
  }

  public static empty(): StatsOutlines {
    return StatsOutlines.EMPTY;
  }

  public static validate(n: unknown): n is ReadonlyArray<StatsOutlineJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return StatsOutline.validate(o);
    });
  }

  private static ofMap(outlines: ReadonlyMap<StatsID, StatsOutline>): StatsOutlines {
    return StatsOutlines.of(ImmutableProject.ofMap<StatsID, StatsOutline>(outlines));
  }

  protected constructor(outlines: ImmutableProject<StatsID, StatsOutline>) {
    super();
    this.outlines = outlines;
  }

  public get(key: StatsID): Nullable<StatsOutline> {
    return this.outlines.get(key);
  }

  public contains(value: StatsOutline): boolean {
    return this.outlines.contains(value);
  }

  public size(): number {
    return this.outlines.size();
  }

  public forEach(iteration: Enumerator<StatsID, StatsOutline>): void {
    this.outlines.forEach(iteration);
  }

  public duplicate(): StatsOutlines {
    if (this.isEmpty()) {
      return StatsOutlines.empty();
    }

    return StatsOutlines.of(this.outlines.duplicate());
  }

  public isEmpty(): boolean {
    return this.outlines.isEmpty();
  }

  public equals(other: StatsOutlines): boolean {
    if (this === other) {
      return true;
    }

    return this.outlines.equals(other.outlines);
  }

  public toJSON(): Array<StatsOutlineJSON> {
    const json: Array<StatsOutlineJSON> = [];

    this.outlines.forEach((outline: StatsOutline) => {
      json.push(outline.toJSON());
    });

    return json;
  }

  public serialize(): string {
    return this.outlines.toString();
  }

  public every(predicate: BinaryPredicate<StatsOutline, StatsID>): boolean {
    return this.outlines.every(predicate);
  }

  public some(predicate: BinaryPredicate<StatsOutline, StatsID>): boolean {
    return this.outlines.some(predicate);
  }

  public values(): Iterable<StatsOutline> {
    return this.outlines.values();
  }

  public filter(predicate: BinaryPredicate<StatsOutline, StatsID>): Collection<StatsID, StatsOutline> {
    return this.outlines.filter(predicate);
  }

  public find(predicate: BinaryPredicate<StatsOutline, StatsID>): Nullable<StatsOutline> {
    return this.outlines.find(predicate);
  }

  public iterator(): Iterator<[StatsID, StatsOutline]> {
    return this.outlines.iterator();
  }

  public map<W>(mapper: Mapper<StatsOutline, W>): Collection<StatsID, W> {
    return this.outlines.map<W>(mapper);
  }
}
