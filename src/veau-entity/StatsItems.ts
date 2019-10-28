import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Collection } from '../veau-general/Collection';
import { JSONable } from '../veau-general/JSONable';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { AsOf } from '../veau-vo/AsOf';
import { AsOfs } from '../veau-vo/AsOfs';
import { StatsItemName } from '../veau-vo/StatsItemName';
import { StatsItem, StatsItemJSON } from './StatsItem';

export class StatsItems implements Collection<number, StatsItem>, JSONable {
  private items: Array<StatsItem>;

  public static from(items: Array<StatsItem>): StatsItems {
    return new StatsItems(items);
  }

  public static fromJSON(json: Array<StatsItemJSON>): StatsItems {
    const items: Array<StatsItem> = json.map<StatsItem>((item: StatsItemJSON): StatsItem => {
      return StatsItem.fromJSON(item);
    });

    return StatsItems.from(items);
  }

  private constructor(items: Array<StatsItem>) {
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

  public getNames(): Array<StatsItemName> {
    return this.items.map<StatsItemName>((item: StatsItem): StatsItemName => {
      return item.getName();
    });
  }

  public getAsOfs(): AsOfs {
    const asOfs: Array<AsOf> = [];

    this.items.forEach((item: StatsItem): void => {
      item.getAsOfs().forEach((asOf: AsOf): void => {
        asOfs.push(asOf);
      });
    });

    return AsOfs.of(asOfs);
  }

  public maxNameLength(): number {
    const lengths: Array<number> = this.items.map<number>((item: StatsItem): number => {
      return item.getName().length();
    });

    return Math.max(...lengths);
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

  public contains(value: StatsItem): boolean {
    const found: StatsItem | undefined = this.items.find((item: StatsItem): boolean => {
      if (value.equals(item)) {
        return true;
      }

      return false;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.items.length;
  }

  public forEach(enumerator: Enumerator<number, StatsItem>): void {
    this.items.forEach(enumerator);
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
      return item.getValues().size();
    });

    const values: number = Math.max(...rowLengths);

    if (values === 0) {
      return false;
    }

    return true;
  }

  public copy(): StatsItems {
    return new StatsItems(this.items.map<StatsItem>((statsItem: StatsItem): StatsItem => {
      return statsItem.copy();
    }));
  }

  public isEmpty(): boolean {
    if (this.items.length === 0) {
      return true;
    }

    return false;
  }

  public equals(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.items.length;
    if (length !== other.size()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.items[i].equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public areSame(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.items.length;
    if (length !== other.size()) {
      return false;
    }

    for (let i: number = 0; i < length; i++) {
      if (!this.items[i].isSame(other.get(i))) {
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

  public toString(): string {
    return this.items.map<string>((item: StatsItem): string => {
      return item.toString();
    }).join(', ');
  }
}
