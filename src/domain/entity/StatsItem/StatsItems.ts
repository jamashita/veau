import { BinaryPredicate, Catalogue, Cloneable, JSONable, Kind, Mapper, Nullable } from '@jamashita/anden-type';
import { Collection, Quantity } from '@jamashita/lluvia-collection';
import { Project } from '@jamashita/lluvia-project';
import { MutableSequence, ReadonlySequence, Sequence } from '@jamashita/lluvia-sequence';
import { AsOfs } from '../../vo/AsOf/AsOfs.js';
import { Column } from '../../vo/Coordinate/Column.js';
import { Row } from '../../vo/Coordinate/Row.js';
import { StatsItemID } from '../../vo/StatsItem/StatsItemID.js';
import { StatsItemName } from '../../vo/StatsItem/StatsItemName.js';
import { StatsItemNames } from '../../vo/StatsItem/StatsItemNames.js';
import { StatsValues } from '../../vo/StatsValue/StatsValues.js';
import { StatsItem, StatsItemJSON, StatsItemRow } from './StatsItem.js';

export class StatsItems extends Quantity<number, StatsItem, 'StatsItems'> implements Cloneable<StatsItems>, JSONable {
  public readonly noun: 'StatsItems' = 'StatsItems';
  private items: MutableSequence<StatsItem>;

  public static empty(): StatsItems {
    return new StatsItems(MutableSequence.empty<StatsItem>());
  }

  public static of(items: ReadonlySequence<StatsItem>): StatsItems {
    if (items.isEmpty()) {
      return StatsItems.empty();
    }

    return new StatsItems(MutableSequence.of<StatsItem>(items));
  }

  public static ofArray(items: ReadonlyArray<StatsItem>): StatsItems {
    return StatsItems.of(MutableSequence.ofArray<StatsItem>(items));
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

  public static ofSpread(...items: Array<StatsItem>): StatsItems {
    return StatsItems.ofArray(items);
  }

  public static validate(n: unknown): n is Array<StatsItemJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return StatsItem.validate(o);
    });
  }

  protected constructor(items: MutableSequence<StatsItem>) {
    super();
    this.items = items;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsItems)) {
      return false;
    }

    return this.items.equals(other.items);
  }

  public serialize(): string {
    return this.items.toString();
  }

  public duplicate(): StatsItems {
    if (this.isEmpty()) {
      return StatsItems.empty();
    }

    return StatsItems.of(this.items.duplicate());
  }

  public iterator(): Iterator<[number, StatsItem]> {
    return this.items.iterator();
  }

  public contains(value: StatsItem): boolean {
    return this.items.contains(value);
  }

  public every(predicate: BinaryPredicate<StatsItem, number>): boolean {
    return this.items.every(predicate);
  }

  public filter(predicate: BinaryPredicate<StatsItem, number>): Collection<number, StatsItem> {
    return this.items.filter(predicate);
  }

  public find(predicate: BinaryPredicate<StatsItem, number>): Nullable<StatsItem> {
    return this.items.find(predicate);
  }

  public forEach(catalogue: Catalogue<number, StatsItem>): void {
    this.items.forEach(catalogue);
  }

  public get(index: number): Nullable<StatsItem> {
    return this.items.get(index);
  }

  public override isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public map<W>(mapper: Mapper<StatsItem, W>): Sequence<W> {
    return this.items.map<W>(mapper);
  }

  public size(): number {
    return this.items.size();
  }

  public some(predicate: BinaryPredicate<StatsItem, number>): boolean {
    return this.items.some(predicate);
  }

  public values(): Iterable<StatsItem> {
    return this.items.values();
  }

  public toJSON(): Array<StatsItemJSON> {
    return this.items.toArray().map<StatsItemJSON>((item: StatsItem) => {
      return item.toJSON();
    });
  }

  public add(statsItem: StatsItem): void {
    this.items.add(statsItem);
  }

  public areFilled(): boolean {
    return this.items.every((statsItem: StatsItem) => {
      return statsItem.isFilled();
    });
  }

  public getAsOfs(): AsOfs {
    const all: Array<AsOfs> = this.items.toArray().map<AsOfs>((item: StatsItem) => {
      return item.getAsOfs();
    });

    return AsOfs.merge(...all);
  }

  public getNames(): StatsItemNames {
    return StatsItemNames.of(this.items.map<StatsItemName>((item: StatsItem) => {
      return item.getName();
    }));
  }

  public haveValues(): boolean {
    if (this.items.isEmpty()) {
      return false;
    }

    const rowLengths: Array<number> = [...this.items.values()].map<number>((item: StatsItem) => {
      return item.getValues().size();
    });

    return !rowLengths.includes(0);
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

  public remove(statsItem: StatsItem): void {
    this.items = this.items.filter((item: StatsItem) => {
      return !item.equals(statsItem);
    });
  }

  public replace(statsItem: StatsItem, to: Row): void {
    const toValue: number = to.get();

    this.items.set(toValue, statsItem);
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
