import {
  CancellableEnumerator,
  MutableSequence,
  Pair,
  Project,
  Quantity,
  Sequence
} from '@jamashita/publikum-collection';
import { Cloneable, JSONable } from '@jamashita/publikum-interface';
import { BinaryPredicate, Kind, Mapper, Nullable } from '@jamashita/publikum-type';
import { AsOfs } from '../../VO/AsOf/AsOfs';
import { Column } from '../../VO/Coordinate/Column';
import { Row } from '../../VO/Coordinate/Row';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsItemName } from '../../VO/StatsItem/StatsItemName';
import { StatsItemNames } from '../../VO/StatsItem/StatsItemNames';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from './StatsItem';

export class StatsItems extends Quantity<StatsItems, number, StatsItem, 'StatsItems'>
  implements Cloneable<StatsItems>, JSONable {
  public readonly noun: 'StatsItems' = 'StatsItems';
  private items: Sequence<StatsItem>;

  public static of(items: Sequence<StatsItem>): StatsItems {
    if (items.isEmpty()) {
      return StatsItems.empty();
    }

    return new StatsItems(items);
  }

  public static ofArray(items: ReadonlyArray<StatsItem>): StatsItems {
    return StatsItems.of(MutableSequence.of<StatsItem>(items));
  }

  public static ofSpread(...items: Array<StatsItem>): StatsItems {
    return StatsItems.ofArray(items);
  }

  public static ofJSON(json: ReadonlyArray<StatsItemJSON>): StatsItems {
    const arr: Array<StatsItem> = json.map<StatsItem>((statsItemJSON: StatsItemJSON) => {
      return StatsItem.ofJSON(statsItemJSON);
    });

    return StatsItems.ofArray(arr);
  }

  public static ofRow(rows: ReadonlyArray<StatsItemRow>, project: Project<StatsItemID, StatsValues>): StatsItems {
    const arr: Array<StatsItem> = rows.map<StatsItem>((statsItemRow: StatsItemRow) => {
      return StatsItem.ofRow(statsItemRow, project);
    });

    return StatsItems.ofArray(arr);
  }

  public static validate(n: unknown): n is Array<StatsItemJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return StatsItem.validate(o);
    });
  }

  public static empty(): StatsItems {
    return new StatsItems(MutableSequence.empty<StatsItem>());
  }

  protected constructor(items: Sequence<StatsItem>) {
    super();
    this.items = items;
  }

  public get(index: number): Nullable<StatsItem> {
    return this.items.get(index);
  }

  public contains(value: StatsItem): boolean {
    return this.items.contains(value);
  }

  public size(): number {
    return this.items.size();
  }

  public forEach(iteration: CancellableEnumerator<number, StatsItem>): void {
    this.items.forEach(iteration);
  }

  public duplicate(): StatsItems {
    if (this.isEmpty()) {
      return StatsItems.empty();
    }

    return StatsItems.of(this.items.duplicate());
  }

  public isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public equals(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }

    return this.items.equals(other.items);
  }

  public toJSON(): Array<StatsItemJSON> {
    return this.items.toArray().map<StatsItemJSON>((item: StatsItem) => {
      return item.toJSON();
    });
  }

  public serialize(): string {
    return this.items.toString();
  }

  public [Symbol.iterator](): Iterator<Pair<number, StatsItem>> {
    return this.items[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<StatsItem, number>): boolean {
    return this.items.every(predicate);
  }

  public some(predicate: BinaryPredicate<StatsItem, number>): boolean {
    return this.items.some(predicate);
  }

  public values(): Iterable<StatsItem> {
    return this.items.values();
  }

  public add(statsItem: StatsItem): void {
    this.items.add(statsItem);
  }

  public getNames(): StatsItemNames {
    return StatsItemNames.of(this.items.map<StatsItemName>((item: StatsItem) => {
      return item.getName();
    }));
  }

  public getAsOfs(): AsOfs {
    const all: Array<AsOfs> = this.items.toArray().map<AsOfs>((item: StatsItem) => {
      return item.getAsOfs();
    });

    return AsOfs.merge(...all);
  }

  public maxNameLength(): number {
    if (this.isEmpty()) {
      return 0;
    }

    const lengths: Array<number> = this.items.toArray().map<number>((item: StatsItem) => {
      return item.getName().length();
    });

    return Math.max(...lengths);
  }

  public move(from: Column, to: Column): void {
    const fromValue: number = from.get();
    const toValue: number = to.get();
    const min: number = Math.min(fromValue, toValue);
    const max: number = Math.max(fromValue, toValue);

    const maxValue: Nullable<StatsItem> = this.items.get(max);
    const minValue: Nullable<StatsItem> = this.items.get(min);

    if (!Kind.isNull(maxValue)) {
      this.items.set(min, maxValue);
    }
    if (!Kind.isNull(minValue)) {
      this.items.set(max, minValue);
    }
  }

  public replace(statsItem: StatsItem, to: Row): void {
    const toValue: number = to.get();

    this.items.set(toValue, statsItem);
  }

  public remove(statsItem: StatsItem): void {
    this.items = this.items.filter((item: StatsItem) => {
      return !item.equals(statsItem);
    });
  }

  public map<U>(mapper: Mapper<StatsItem, U>): Array<U> {
    return this.items.toArray().map<U>(mapper);
  }

  public areFilled(): boolean {
    return this.items.every((statsItem: StatsItem) => {
      return statsItem.isFilled();
    });
  }

  public haveValues(): boolean {
    if (this.items.isEmpty()) {
      return false;
    }

    const rowLengths: Array<number> = this.map<number>((item: StatsItem) => {
      return item.getValues().size();
    });

    return !rowLengths.includes(0);
  }

  public same(other: StatsItems): boolean {
    if (this === other) {
      return true;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    const thisIterator: Iterator<StatsItem> = this.values()[Symbol.iterator]();
    const otherIterator: Iterator<StatsItem> = other.values()[Symbol.iterator]();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const thisRes: IteratorResult<StatsItem> = thisIterator.next();
      const otherRes: IteratorResult<StatsItem> = otherIterator.next();

      if (thisRes.done !== true && otherRes.done !== true) {
        if (!thisRes.value.equals(otherRes.value)) {
          return false;
        }

        continue;
      }
      if (thisRes.done === true && otherRes.done === true) {
        return true;
      }

      return false;
    }
  }
}
