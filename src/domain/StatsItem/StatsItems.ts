import { BinaryPredicate, Cloneable, ForEach, JSONable, Kind, Mapping, Nullable } from '@jamashita/anden-type';
import { Collection, Quantity } from '@jamashita/lluvia-collection';
import { Project } from '@jamashita/lluvia-project';
import { MutableSequence, ReadonlySequence, Sequence } from '@jamashita/lluvia-sequence';
import { AsOfs } from '../AsOf/AsOfs.js';
import { Column } from '../Coordinate/Column.js';
import { Row } from '../Coordinate/Row.js';
import { StatsValues } from '../StatsValue/StatsValues.js';
import { StatsItem, StatsItemJSON, StatsItemRow } from './StatsItem.js';
import { StatsItemID } from './StatsItemID.js';
import { StatsItemName } from './StatsItemName.js';
import { StatsItemNames } from './StatsItemNames.js';

export class StatsItems extends Quantity<number, StatsItem> implements Cloneable<StatsItems>, JSONable {
  private items: MutableSequence<StatsItem>;

  public static empty(): StatsItems {
    return new StatsItems(MutableSequence.empty());
  }

  public static of(items: ReadonlySequence<StatsItem>): StatsItems {
    if (items.isEmpty()) {
      return StatsItems.empty();
    }

    return new StatsItems(MutableSequence.of(items));
  }

  public static ofArray(items: ReadonlyArray<StatsItem>): StatsItems {
    return StatsItems.of(MutableSequence.ofArray(items));
  }

  public static ofJSON(json: ReadonlyArray<StatsItemJSON>): StatsItems {
    const arr: Array<StatsItem> = json.map((statsItemJSON: StatsItemJSON): StatsItem => {
      return StatsItem.ofJSON(statsItemJSON);
    });

    return StatsItems.ofArray(arr);
  }

  public static ofRow(rows: ReadonlyArray<StatsItemRow>, project: Project<StatsItemID, StatsValues>): StatsItems {
    const arr: Array<StatsItem> = rows.map((statsItemRow: StatsItemRow): StatsItem => {
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

  public add(statsItem: StatsItem): void {
    this.items.add(statsItem);
  }

  public areFilled(): boolean {
    return this.items.every((statsItem: StatsItem) => {
      return statsItem.isFilled();
    });
  }

  public contains(value: StatsItem): boolean {
    return this.items.contains(value);
  }

  public duplicate(): StatsItems {
    if (this.isEmpty()) {
      return StatsItems.empty();
    }

    return StatsItems.of(this.items.duplicate());
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

  public every(predicate: BinaryPredicate<StatsItem, number>): boolean {
    return this.items.every(predicate);
  }

  public filter(predicate: BinaryPredicate<StatsItem, number>): Collection<number, StatsItem> {
    return this.items.filter(predicate);
  }

  public find(predicate: BinaryPredicate<StatsItem, number>): Nullable<StatsItem> {
    return this.items.find(predicate);
  }

  public forEach(foreach: ForEach<number, StatsItem>): void {
    this.items.forEach(foreach);
  }

  public get(index: number): Nullable<StatsItem> {
    return this.items.get(index);
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

  public override isEmpty(): boolean {
    return this.items.isEmpty();
  }

  public iterator(): Iterator<[number, StatsItem]> {
    return this.items.iterator();
  }

  public map<W>(mapping: Mapping<StatsItem, W>): Sequence<W> {
    return this.items.map(mapping);
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

    return this.items.every((s: StatsItem, i: number) => {
      return s.equals(other.get(i));
    });
  }

  public serialize(): string {
    return this.items.toString();
  }

  public size(): number {
    return this.items.size();
  }

  public some(predicate: BinaryPredicate<StatsItem, number>): boolean {
    return this.items.some(predicate);
  }

  public toJSON(): Array<StatsItemJSON> {
    return this.items.toArray().map((item: StatsItem): StatsItemJSON => {
      return item.toJSON();
    });
  }

  public values(): Iterable<StatsItem> {
    return this.items.values();
  }
}
