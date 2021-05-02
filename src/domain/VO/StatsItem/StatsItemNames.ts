import { BinaryPredicate, Catalogue, JSONable, Mapper, Nullable } from '@jamashita/anden-type';
import { Collection, ImmutableSequence, Quantity, ReadonlySequence } from '@jamashita/lluvia-collection';
import { StatsItemName } from './StatsItemName';

export class StatsItemNames extends Quantity<number, StatsItemName, 'StatsItemNames'>
  implements JSONable<Array<string>> {
  public readonly noun: 'StatsItemNames' = 'StatsItemNames';
  private readonly names: ImmutableSequence<StatsItemName>;

  private static readonly EMPTY: StatsItemNames = new StatsItemNames(ImmutableSequence.empty<StatsItemName>());

  public static empty(): StatsItemNames {
    return StatsItemNames.EMPTY;
  }

  public static of(names: ReadonlySequence<StatsItemName>): StatsItemNames {
    return StatsItemNames.ofArray(names.toArray());
  }

  public static ofArray(names: ReadonlyArray<StatsItemName>): StatsItemNames {
    if (names.length === 0) {
      return StatsItemNames.empty();
    }

    return new StatsItemNames(ImmutableSequence.ofArray<StatsItemName>(names));
  }

  public static ofSpread(...names: Array<StatsItemName>): StatsItemNames {
    return StatsItemNames.ofArray(names);
  }

  protected constructor(names: ImmutableSequence<StatsItemName>) {
    super();
    this.names = names;
  }

  public contains(value: StatsItemName): boolean {
    return this.names.contains(value);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsItemNames)) {
      return false;
    }

    return this.names.equals(other.names);
  }

  public every(predicate: BinaryPredicate<StatsItemName, number>): boolean {
    return this.names.every(predicate);
  }

  public filter(predicate: BinaryPredicate<StatsItemName, number>): Collection<number, StatsItemName> {
    return this.names.filter(predicate);
  }

  public find(predicate: BinaryPredicate<StatsItemName, number>): Nullable<StatsItemName> {
    return this.names.find(predicate);
  }

  public forEach(catalogue: Catalogue<number, StatsItemName>): void {
    this.names.forEach(catalogue);
  }

  public get(index: number): Nullable<StatsItemName> {
    return this.names.get(index);
  }

  public isEmpty(): boolean {
    return this.names.isEmpty();
  }

  public iterator(): Iterator<[number, StatsItemName]> {
    return this.names.iterator();
  }

  public map<W>(mapper: Mapper<StatsItemName, W>): ImmutableSequence<W> {
    return this.names.map<W>(mapper);
  }

  public serialize(): string {
    return this.names.toString();
  }

  public size(): number {
    return this.names.size();
  }

  public some(predicate: BinaryPredicate<StatsItemName, number>): boolean {
    return this.names.some(predicate);
  }

  public toJSON(): Array<string> {
    return this.names.toArray().map<string>((name: StatsItemName) => {
      return name.get();
    });
  }

  public values(): Iterable<StatsItemName> {
    return this.names.values();
  }
}
