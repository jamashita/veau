import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/lluvia-collection';
import { BinaryPredicate, Mapper, Nullable } from '@jamashita/anden-type';
import { StatsListItem } from './StatsListItem';

export class StatsListItems extends Quantity<StatsListItems, number, StatsListItem, 'StatsListItems'> {
  public readonly noun: 'StatsListItems' = 'StatsListItems';
  private readonly items: Sequence<StatsListItem>;

  private static readonly EMPTY: StatsListItems = new StatsListItems(ImmutableSequence.empty<StatsListItem>());

  public static of(items: Sequence<StatsListItem>): StatsListItems {
    if (items.isEmpty()) {
      return StatsListItems.empty();
    }

    return new StatsListItems(items);
  }

  public static ofArray(items: ReadonlyArray<StatsListItem>): StatsListItems {
    return StatsListItems.of(ImmutableSequence.of<StatsListItem>(items));
  }

  public static ofSpread(...items: Array<StatsListItem>): StatsListItems {
    return StatsListItems.ofArray(items);
  }

  public static empty(): StatsListItems {
    return StatsListItems.EMPTY;
  }

  protected constructor(items: Sequence<StatsListItem>) {
    super();
    this.items = items;
  }

  public get(index: number): Nullable<StatsListItem> {
    return this.items.get(index);
  }

  public contains(value: StatsListItem): boolean {
    return this.items.contains(value);
  }

  public size(): number {
    return this.items.size();
  }

  public forEach(iteration: CancellableEnumerator<number, StatsListItem>): void {
    this.items.forEach(iteration);
  }

  public isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public equals(other: StatsListItems): boolean {
    if (this === other) {
      return true;
    }

    return this.items.equals(other.items);
  }

  public serialize(): string {
    return this.items.toString();
  }

  public [Symbol.iterator](): Iterator<Pair<number, StatsListItem>> {
    return this.items[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<StatsListItem, number>): boolean {
    return this.items.every(predicate);
  }

  public some(predicate: BinaryPredicate<StatsListItem, number>): boolean {
    return this.items.some(predicate);
  }

  public values(): Iterable<StatsListItem> {
    return this.items.values();
  }

  public map<U>(mapper: Mapper<StatsListItem, U>): Array<U> {
    return this.items.toArray().map<U>(mapper);
  }
}
