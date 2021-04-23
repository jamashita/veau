import { BinaryPredicate, Enumerator, JSONable, Mapper, Nullable } from '@jamashita/anden-type';
import { Collection, ImmutableSequence, Quantity, Sequence } from '@jamashita/lluvia-collection';
import { StatsItemName } from './StatsItemName';

export class StatsItemNames extends Quantity<number, StatsItemName, 'StatsItemNames'>
  implements JSONable<Array<string>> {
  public readonly noun: 'StatsItemNames' = 'StatsItemNames';
  private readonly names: Sequence<StatsItemName>;
  private static readonly EMPTY: StatsItemNames = new StatsItemNames(ImmutableSequence.empty<StatsItemName>());

  public static of(names: Sequence<StatsItemName>): StatsItemNames {
    if (names.isEmpty()) {
      return StatsItemNames.empty();
    }

    return new StatsItemNames(names);
  }

  public static ofArray(names: ReadonlyArray<StatsItemName>): StatsItemNames {
    return StatsItemNames.of(ImmutableSequence.ofArray<StatsItemName>(names));
  }

  public static ofSpread(...names: Array<StatsItemName>): StatsItemNames {
    return StatsItemNames.ofArray(names);
  }

  public static empty(): StatsItemNames {
    return StatsItemNames.EMPTY;
  }

  protected constructor(names: Sequence<StatsItemName>) {
    super();
    this.names = names;
  }

  public get(index: number): Nullable<StatsItemName> {
    return this.names.get(index);
  }

  public contains(value: StatsItemName): boolean {
    return this.names.contains(value);
  }

  public size(): number {
    return this.names.size();
  }

  public forEach(iteration: Enumerator<number, StatsItemName>): void {
    this.names.forEach(iteration);
  }

  public isEmpty(): boolean {
    return this.names.isEmpty();
  }

  public equals(other: StatsItemNames): boolean {
    if (this === other) {
      return true;
    }

    return this.names.equals(other.names);
  }

  public toJSON(): Array<string> {
    return this.names.toArray().map<string>((name: StatsItemName) => {
      return name.get();
    });
  }

  public serialize(): string {
    return this.names.toString();
  }

  public every(predicate: BinaryPredicate<StatsItemName, number>): boolean {
    return this.names.every(predicate);
  }

  public some(predicate: BinaryPredicate<StatsItemName, number>): boolean {
    return this.names.some(predicate);
  }

  public values(): Iterable<StatsItemName> {
    return this.names.values();
  }

  public filter(predicate: BinaryPredicate<StatsItemName, number>): Collection<number, StatsItemName> {
    return this.names.filter(predicate);
  }

  public find(predicate: BinaryPredicate<StatsItemName, number>): Nullable<StatsItemName> {
    return this.names.find(predicate);
  }

  public iterator(): Iterator<[number, StatsItemName]> {
    return this.names.iterator();
  }

  public map<W>(mapper: Mapper<StatsItemName, W>): Collection<number, W> {
    return this.names.map<W>(mapper);
  }
}
