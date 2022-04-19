import { BinaryPredicate, ForEach, Mapping, Nullable } from '@jamashita/anden-type';
import { Quantity } from '@jamashita/lluvia-collection';
import { ImmutableSequence, ReadonlySequence } from '@jamashita/lluvia-sequence';
import { StatsListItem } from './StatsListItem.js';

export class StatsListItems extends Quantity<number, StatsListItem> {
  private readonly items: ImmutableSequence<StatsListItem>;

  private static readonly EMPTY: StatsListItems = new StatsListItems(ImmutableSequence.empty());

  public static empty(): StatsListItems {
    return StatsListItems.EMPTY;
  }

  public static of(items: ReadonlySequence<StatsListItem>): StatsListItems {
    if (items.isEmpty()) {
      return StatsListItems.empty();
    }

    return new StatsListItems(ImmutableSequence.of(items));
  }

  public static ofArray(items: ReadonlyArray<StatsListItem>): StatsListItems {
    return StatsListItems.of(ImmutableSequence.ofArray(items));
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

  public filter(predicate: BinaryPredicate<StatsListItem, number>): StatsListItems {
    return StatsListItems.of(this.items.filter(predicate));
  }

  public find(predicate: BinaryPredicate<StatsListItem, number>): Nullable<StatsListItem> {
    return this.items.find(predicate);
  }

  public forEach(foreach: ForEach<number, StatsListItem>): void {
    this.items.forEach(foreach);
  }

  public get(index: number): Nullable<StatsListItem> {
    return this.items.get(index);
  }

  public override isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public iterator(): Iterator<[number, StatsListItem]> {
    return this.items.iterator();
  }

  public map<W>(mapping: Mapping<StatsListItem, W>): ImmutableSequence<W> {
    return this.items.map<W>(mapping);
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
