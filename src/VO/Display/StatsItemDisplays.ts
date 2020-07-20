import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/publikum-collection';
import { BinaryPredicate, Mapper, Nullable } from '@jamashita/publikum-type';

import { AsOfs } from '../AsOf/AsOfs';
import { StatsItemName } from '../StatsItem/StatsItemName';
import { StatsItemNames } from '../StatsItem/StatsItemNames';
import { StatsItemDisplay } from './StatsItemDisplay';

export class StatsItemDisplays extends Quantity<StatsItemDisplays, number, StatsItemDisplay, 'StatsItemsDisplays'> {
  public readonly noun: 'StatsItemsDisplays' = 'StatsItemsDisplays';
  private readonly items: Sequence<StatsItemDisplay>;
  private static readonly EMPTY: StatsItemDisplays = new StatsItemDisplays(ImmutableSequence.empty<StatsItemDisplay>());

  public static of(items: Sequence<StatsItemDisplay>): StatsItemDisplays {
    if (items.isEmpty()) {
      return StatsItemDisplays.empty();
    }

    return new StatsItemDisplays(items);
  }

  public static ofArray(items: Array<StatsItemDisplay>): StatsItemDisplays {
    return StatsItemDisplays.of(ImmutableSequence.of<StatsItemDisplay>(items));
  }

  public static ofSpread(...items: Array<StatsItemDisplay>): StatsItemDisplays {
    return StatsItemDisplays.ofArray(items);
  }

  public static empty(): StatsItemDisplays {
    return StatsItemDisplays.EMPTY;
  }

  protected constructor(items: Sequence<StatsItemDisplay>) {
    super();
    this.items = items;
  }

  public get(index: number): Nullable<StatsItemDisplay> {
    return this.items.get(index);
  }

  public contains(value: StatsItemDisplay): boolean {
    return this.items.contains(value);
  }

  public size(): number {
    return this.items.size();
  }

  public forEach(iteration: CancellableEnumerator<number, StatsItemDisplay>): void {
    this.items.forEach(iteration);
  }

  public isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public equals(other: StatsItemDisplays): boolean {
    if (this === other) {
      return true;
    }

    return this.items.equals(other.items);
  }

  public serialize(): string {
    return this.items.toString();
  }

  public [Symbol.iterator](): Iterator<Pair<number, StatsItemDisplay>> {
    return this.items[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<StatsItemDisplay, number>): boolean {
    return this.items.every(predicate);
  }

  public some(predicate: BinaryPredicate<StatsItemDisplay, number>): boolean {
    return this.items.some(predicate);
  }

  public getNames(): StatsItemNames {
    return StatsItemNames.of(
      this.items.map<StatsItemName>((item: StatsItemDisplay) => {
        return item.getName();
      })
    );
  }

  public getAsOfs(): AsOfs {
    const all: Array<AsOfs> = this.items.toArray().map<AsOfs>((item: StatsItemDisplay) => {
      return item.getAsOfs();
    });

    return AsOfs.merge(...all);
  }

  public maxNameLength(): number {
    if (this.isEmpty()) {
      return 0;
    }

    const lengths: Array<number> = this.items.toArray().map<number>((item: StatsItemDisplay) => {
      return item.getName().length();
    });

    return Math.max(...lengths);
  }

  public map<U>(mapper: Mapper<StatsItemDisplay, U>): Array<U> {
    return this.items.toArray().map<U>(mapper);
  }

  public areFilled(): boolean {
    return this.items.every((statsItem: StatsItemDisplay) => {
      return statsItem.isFilled();
    });
  }

  public haveValues(): boolean {
    if (this.items.isEmpty()) {
      return false;
    }

    const rowLengths: Array<number> = this.items.toArray().map<number>((item: StatsItemDisplay) => {
      return item.getValues().size();
    });

    const values: number = Math.max(...rowLengths);

    if (values === 0) {
      return false;
    }

    return true;
  }
}
