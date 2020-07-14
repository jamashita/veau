import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/publikum-collection';
import { Mapper, Nullable } from '@jamashita/publikum-type';

import { StatsListItem } from './StatsListItem';

// TODO TESTS UNDONE
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

  public static ofArray(items: Array<StatsListItem>): StatsListItems {
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

  public map<U>(mapper: Mapper<StatsListItem, U>): Array<U> {
    return this.items.toArray().map<U>(mapper);
  }

  public iterator(): Iterator<Pair<number, StatsListItem>> {
    return this.items.iterator();
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
}
