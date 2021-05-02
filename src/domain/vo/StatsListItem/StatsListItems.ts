import { BinaryPredicate, Catalogue, Mapper, Nullable } from '@jamashita/anden-type';
import { Collection, ImmutableSequence, Quantity, ReadonlySequence } from '@jamashita/lluvia-collection';
import { StatsListItem } from './StatsListItem';

export class StatsListItems extends Quantity<number, StatsListItem, 'StatsListItems'> {
  public readonly noun: 'StatsListItems' = 'StatsListItems';
  private readonly items: ImmutableSequence<StatsListItem>;

  private static readonly EMPTY: StatsListItems = new StatsListItems(ImmutableSequence.empty<StatsListItem>());

  public static empty(): StatsListItems {
    return StatsListItems.EMPTY;
  }

  public static of(items: ReadonlySequence<StatsListItem>): StatsListItems {
    if (items.isEmpty()) {
      return StatsListItems.empty();
    }

    return new StatsListItems(ImmutableSequence.of<StatsListItem>(items));
  }

  public static ofArray(items: ReadonlyArray<StatsListItem>): StatsListItems {
    return StatsListItems.of(ImmutableSequence.ofArray<StatsListItem>(items));
  }

  public static ofSpread(...items: Array<StatsListItem>): StatsListItems {
    return StatsListItems.ofArray(items);
  }

  protected constructor(items: ImmutableSequence<StatsListItem>) {
    super();
    this.items = items;
  }

  public contains(value: StatsListItem): boolean {
    return this.items.contains(value);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsListItems)) {
      return false;
    }

    return this.items.equals(other.items);
  }

  public every(predicate: BinaryPredicate<StatsListItem, number>): boolean {
    return this.items.every(predicate);
  }

  public filter(predicate: BinaryPredicate<StatsListItem, number>): Collection<number, StatsListItem> {
    return this.items.filter(predicate);
  }

  public find(predicate: BinaryPredicate<StatsListItem, number>): Nullable<StatsListItem> {
    return this.items.find(predicate);
  }

  public forEach(catalogue: Catalogue<number, StatsListItem>): void {
    this.items.forEach(catalogue);
  }

  public get(index: number): Nullable<StatsListItem> {
    return this.items.get(index);
  }

  public isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public iterator(): Iterator<[number, StatsListItem]> {
    return this.items.iterator();
  }

  public map<W>(mapper: Mapper<StatsListItem, W>): ImmutableSequence<W> {
    return this.items.map<W>(mapper);
  }

  public serialize(): string {
    return this.items.toString();
  }

  public size(): number {
    return this.items.size();
  }

  public some(predicate: BinaryPredicate<StatsListItem, number>): boolean {
    return this.items.some(predicate);
  }

  public values(): Iterable<StatsListItem> {
    return this.items.values();
  }
}
