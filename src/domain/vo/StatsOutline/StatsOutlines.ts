import { BinaryPredicate, Catalogue, Cloneable, JSONable, Kind, Mapper, Nullable } from '@jamashita/anden-type';
import { Quantity } from '@jamashita/lluvia-collection';
import { ImmutableProject, ReadonlyProject } from '@jamashita/lluvia-project';
import { StatsID } from './StatsID.js';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from './StatsOutline.js';

export class StatsOutlines extends Quantity<StatsID, StatsOutline, 'StatsOutlines'> implements Cloneable<StatsOutlines>, JSONable<Array<StatsOutlineJSON>> {
  public readonly noun: 'StatsOutlines' = 'StatsOutlines';
  private readonly outlines: ImmutableProject<StatsID, StatsOutline>;

  private static readonly EMPTY: StatsOutlines = new StatsOutlines(ImmutableProject.empty<StatsID, StatsOutline>());

  public static empty(): StatsOutlines {
    return StatsOutlines.EMPTY;
  }

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

  public static ofJSON(json: ReadonlyArray<StatsOutlineJSON>): StatsOutlines {
    const arr: Array<StatsOutline> = json.map<StatsOutline>((outline: StatsOutlineJSON) => {
      return StatsOutline.ofJSON(outline);
    });

    return StatsOutlines.ofArray(arr);
  }

  private static ofMap(outlines: ReadonlyMap<StatsID, StatsOutline>): StatsOutlines {
    return StatsOutlines.of(ImmutableProject.ofMap<StatsID, StatsOutline>(outlines));
  }

  public static ofRow(rows: ReadonlyArray<StatsOutlineRow>): StatsOutlines {
    const arr: Array<StatsOutline> = rows.map<StatsOutline>((outline: StatsOutlineJSON) => {
      return StatsOutline.ofRow(outline);
    });

    return StatsOutlines.ofArray(arr);
  }

  public static ofSpread(...outlines: ReadonlyArray<StatsOutline>): StatsOutlines {
    return StatsOutlines.ofArray(outlines);
  }

  public static validate(n: unknown): n is ReadonlyArray<StatsOutlineJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return StatsOutline.validate(o);
    });
  }

  protected constructor(outlines: ImmutableProject<StatsID, StatsOutline>) {
    super();
    this.outlines = outlines;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsOutlines)) {
      return false;
    }

    return this.outlines.equals(other.outlines);
  }

  public serialize(): string {
    return this.outlines.toString();
  }

  public duplicate(): StatsOutlines {
    if (this.isEmpty()) {
      return StatsOutlines.empty();
    }

    return StatsOutlines.of(this.outlines.duplicate());
  }

  public iterator(): Iterator<[StatsID, StatsOutline]> {
    return this.outlines.iterator();
  }

  public contains(value: StatsOutline): boolean {
    return this.outlines.contains(value);
  }

  public every(predicate: BinaryPredicate<StatsOutline, StatsID>): boolean {
    return this.outlines.every(predicate);
  }

  public filter(predicate: BinaryPredicate<StatsOutline, StatsID>): StatsOutlines {
    return StatsOutlines.of(this.outlines.filter(predicate));
  }

  public find(predicate: BinaryPredicate<StatsOutline, StatsID>): Nullable<StatsOutline> {
    return this.outlines.find(predicate);
  }

  public forEach(catalogue: Catalogue<StatsID, StatsOutline>): void {
    this.outlines.forEach(catalogue);
  }

  public get(key: StatsID): Nullable<StatsOutline> {
    return this.outlines.get(key);
  }

  public override isEmpty(): boolean {
    return this.outlines.isEmpty();
  }

  public map<W>(mapper: Mapper<StatsOutline, W>): ImmutableProject<StatsID, W> {
    return this.outlines.map<W>(mapper);
  }

  public size(): number {
    return this.outlines.size();
  }

  public some(predicate: BinaryPredicate<StatsOutline, StatsID>): boolean {
    return this.outlines.some(predicate);
  }

  public values(): Iterable<StatsOutline> {
    return this.outlines.values();
  }

  public toJSON(): Array<StatsOutlineJSON> {
    const json: Array<StatsOutlineJSON> = [];

    this.outlines.forEach((outline: StatsOutline) => {
      json.push(outline.toJSON());
    });

    return json;
  }

  public toArray(): Array<StatsOutline> {
    return [...this.outlines.values()];
  }
}
