import { BinaryPredicate, ForEach, JSONable, Mapping, Nullable } from '@jamashita/anden-type';
import { Quantity } from '@jamashita/lluvia-collection';
import { ImmutableSequence, ReadonlySequence } from '@jamashita/lluvia-sequence';
import { StatsItemName } from './StatsItemName.js';

export class StatsItemNames extends Quantity<number, StatsItemName>
  implements JSONable<Array<string>> {
  private readonly names: ImmutableSequence<StatsItemName>;

  private static readonly EMPTY: StatsItemNames = new StatsItemNames(ImmutableSequence.empty());

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

    return new StatsItemNames(ImmutableSequence.ofArray(names));
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

  public filter(predicate: BinaryPredicate<StatsItemName, number>): StatsItemNames {
    return StatsItemNames.of(this.names.filter(predicate));
  }

  public find(predicate: BinaryPredicate<StatsItemName, number>): Nullable<StatsItemName> {
    return this.names.find(predicate);
  }

  public forEach(foreach: ForEach<number, StatsItemName>): void {
    this.names.forEach(foreach);
  }

  public get(index: number): Nullable<StatsItemName> {
    return this.names.get(index);
  }

  public override isEmpty(): boolean {
    return this.names.isEmpty();
  }

  public iterator(): Iterator<[number, StatsItemName]> {
    return this.names.iterator();
  }

  public map<W>(mapping: Mapping<StatsItemName, W>): ImmutableSequence<W> {
    return this.names.map<W>(mapping);
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
