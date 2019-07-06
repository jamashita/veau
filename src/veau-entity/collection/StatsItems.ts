import * as moment from 'moment';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsItem, StatsItemJSON } from '../StatsItem';

export class StatsItems {
  private items: Array<StatsItem>;

  public constructor(items: Array<StatsItem>) {
    this.items = items;
  }

  public add(statsItem: StatsItem): StatsItems {
    return new StatsItems([
      ...this.items,
      statsItem
    ]);
  }

  public get(index: number): StatsItem {
    const statsItem: StatsItem | undefined = this.items[index];

    if (statsItem === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return statsItem;
  }

  public getNames(): Array<string> {
    return this.items.map<string>((item: StatsItem): string => {
      return item.getName();
    });
  }

  public getAsOfs(): Array<moment.Moment> {
    return this.items.map<Array<moment.Moment>>((item: StatsItem): moment.Moment => {
      return item.getAsOfs();
    }).flat();
  }

  public move(from: number, to: number): StatsItems {
    const {
      items
    } = this;
    const min: number = Math.min(from, to);
    const max: number = Math.max(from, to);

    const newItems: Array<StatsItem> = [
      ...items.slice(0, min),
      items[max],
      ...items.slice(min + 1, max),
      items[min],
      ...items.slice(max + 1)
    ];

    return new StatsItems(newItems);
  }

  public replace(statsItem: StatsItem, to: number): StatsItems {
    const {
      items
    } = this;

    const newItems: Array<StatsItem> = [
      ...items.slice(0, to),
      statsItem,
      ...items.slice(to + 1)
    ];

    return new StatsItems(newItems);
  }

  public remove(statsItem: StatsItem): StatsItems {
    const items: Array<StatsItem> = this.items.filter((item: StatsItem): boolean => {
      if (item.equals(statsItem)) {
        return false;
      }

      return true;
    });

    return new StatsItems(items);
  }

  public length(): number {
    return this.items.length;
  }

  public forEach(consumer: (statsItem: StatsItem, index: number) => void): void {
    this.items.forEach(consumer);
  }

  public areFilled(): boolean {
    return this.items.every((statsItem: StatsItem): boolean => {
      if (statsItem.isFilled()) {
        return true;
      }

      return false;
    });
  }

  public areValid(): boolean {
    return this.areFilled();
  }

  public haveValues(): boolean {
    const {
      items
    } = this;

    if (items.length === 0) {
      return false;
    }

    const rowLengths: Array<number> = items.map<number>((item: StatsItem): number => {
      return item.getValues().length();
    });

    const values: number = Math.max(...rowLengths);

    if (values === 0) {
      return false;
    }

    return true;
  }


  public copy(): StatsItems {
    const items: Array<StatsItem> = [];

    this.items.forEach((statsItem: StatsItem): void => {
      items.push(statsItem.copy());
    });

    return new StatsItems(items);
  }

  public equals(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.items.length;

    if (length !== other.length()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.items[i].equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toJSON(): Array<StatsItemJSON> {
    return this.items.map<StatsItemJSON>((item: StatsItem): StatsItemJSON => {
      return item.toJSON();
    });
  }
}
