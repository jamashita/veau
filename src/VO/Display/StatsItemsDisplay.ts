import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/publikum-collection';
import { Mapper, Nullable } from '@jamashita/publikum-type';

import { AsOfs } from '../AsOf/AsOfs';
import { StatsItemName } from '../StatsItem/StatsItemName';
import { StatsItemNames } from '../StatsItem/StatsItemNames';
import { StatsItemDisplay } from './StatsItemDisplay';

export class StatsItemsDisplay extends Quantity<StatsItemsDisplay, number, StatsItemDisplay, 'StatsItemsDisplay'> {
  public readonly noun: 'StatsItemsDisplay' = 'StatsItemsDisplay';
  private readonly items: Sequence<StatsItemDisplay>;

  private static readonly EMPTY: StatsItemsDisplay = new StatsItemsDisplay(ImmutableSequence.empty<StatsItemDisplay>());

  public static of(items: Sequence<StatsItemDisplay>): StatsItemsDisplay {
    if (items.isEmpty()) {
      return StatsItemsDisplay.empty();
    }

    return new StatsItemsDisplay(items);
  }

  public static ofArray(items: Array<StatsItemDisplay>): StatsItemsDisplay {
    return StatsItemsDisplay.of(ImmutableSequence.of<StatsItemDisplay>(items));
  }

  public static ofSpread(...items: Array<StatsItemDisplay>): StatsItemsDisplay {
    return StatsItemsDisplay.ofArray(items);
  }

  public static empty(): StatsItemsDisplay {
    return StatsItemsDisplay.EMPTY;
  }

  protected constructor(items: Sequence<StatsItemDisplay>) {
    super();
    this.items = items;
  }

  public get(index: number): Nullable<StatsItemDisplay> {
    return this.items.get(index);
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

  public contains(value: StatsItemDisplay): boolean {
    return this.items.contains(value);
  }

  public size(): number {
    return this.items.size();
  }

  public forEach(iteration: CancellableEnumerator<number, StatsItemDisplay>): void {
    this.items.forEach(iteration);
  }

  public iterator(): Iterator<Pair<number, StatsItemDisplay>> {
    return this.items.iterator();
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

  public isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public equals(other: StatsItemsDisplay): boolean {
    if (this === other) {
      return true;
    }
    if (this.items.size() !== other.size()) {
      return false;
    }

    return this.items.equals(other.items);
  }

  public serialize(): string {
    return this.items.toString();
  }
}
