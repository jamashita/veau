import { BinaryPredicate, Cloneable, ForEach, JSONable, Kind, Mapping, Nullable } from '@jamashita/anden-type';
import { Quantity } from '@jamashita/lluvia-collection';
import { ImmutableProject, ReadonlyProject } from '@jamashita/lluvia-project';
import { AsOf } from '../AsOf/AsOf.js';
import { AsOfs } from '../AsOf/AsOfs.js';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue.js';

export class StatsValues extends Quantity<AsOf, StatsValue> implements Cloneable<StatsValues>, JSONable<Array<StatsValueJSON>> {
  private readonly vals: ImmutableProject<AsOf, StatsValue>;

  private static readonly EMPTY: StatsValues = new StatsValues(ImmutableProject.empty());

  public static empty(): StatsValues {
    return StatsValues.EMPTY;
  }

  public static of(values: ReadonlyProject<AsOf, StatsValue>): StatsValues {
    return StatsValues.ofMap(values.toMap());
  }

  public static ofArray(values: ReadonlyArray<StatsValue>): StatsValues {
    const map: Map<AsOf, StatsValue> = new Map();

    values.forEach((value: StatsValue) => {
      map.set(value.getAsOf(), value);
    });

    return StatsValues.ofMap(map);
  }

  public static ofJSON(json: ReadonlyArray<StatsValueJSON>): StatsValues {
    const arr: Array<StatsValue> = json.map((statsValue: StatsValueJSON): StatsValue => {
      return StatsValue.ofJSON(statsValue);
    });

    return StatsValues.ofArray(arr);
  }

  protected static ofMap(values: ReadonlyMap<AsOf, StatsValue>): StatsValues {
    if (values.size === 0) {
      return StatsValues.empty();
    }

    return new StatsValues(ImmutableProject.ofMap(values));
  }

  public static ofRow(rows: ReadonlyArray<StatsValueRow>): StatsValues {
    const arr: Array<StatsValue> = rows.map((statsValue: StatsValueRow): StatsValue => {
      return StatsValue.ofRow(statsValue);
    });

    return StatsValues.ofArray(arr);
  }

  public static validate(n: unknown): n is Array<StatsValueJSON> {
    if (!Kind.isArray(n)) {
      return false;
    }

    return n.every((o: unknown) => {
      return StatsValue.validate(o);
    });
  }

  protected constructor(values: ImmutableProject<AsOf, StatsValue>) {
    super();
    this.vals = values;
  }

  public contains(value: StatsValue): boolean {
    return this.vals.contains(value);
  }

  public delete(asOf: AsOf): StatsValues {
    return StatsValues.of(this.vals.remove(asOf));
  }

  public duplicate(): StatsValues {
    if (this.isEmpty()) {
      return StatsValues.empty();
    }

    return StatsValues.of(this.vals.duplicate());
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsValues)) {
      return false;
    }

    return this.vals.equals(other.vals);
  }

  public every(predicate: BinaryPredicate<StatsValue, AsOf>): boolean {
    return this.vals.every(predicate);
  }

  public filter(predicate: BinaryPredicate<StatsValue, AsOf>): StatsValues {
    return StatsValues.of(this.vals.filter(predicate));
  }

  public find(predicate: BinaryPredicate<StatsValue, AsOf>): Nullable<StatsValue> {
    return this.vals.find(predicate);
  }

  public forEach(foreach: ForEach<AsOf, StatsValue>): void {
    this.vals.forEach(foreach);
  }

  public get(key: AsOf): Nullable<StatsValue> {
    return this.vals.get(key);
  }

  public getAsOfs(): AsOfs {
    return AsOfs.ofArray([...this.vals.toMap().keys()]);
  }

  public override isEmpty(): boolean {
    return this.vals.isEmpty();
  }

  public iterator(): Iterator<[AsOf, StatsValue]> {
    return this.vals[Symbol.iterator]();
  }

  public map<W>(mapping: Mapping<StatsValue, W>): ImmutableProject<AsOf, W> {
    return this.vals.map(mapping);
  }

  public serialize(): string {
    const strs: Array<string> = [];

    this.vals.forEach((value: StatsValue) => {
      strs.push(value.toString());
    });

    return strs.join(', ');
  }

  public set(statsValue: StatsValue): StatsValues {
    return StatsValues.of(this.vals.set(statsValue.getAsOf(), statsValue));
  }

  public size(): number {
    return this.vals.size();
  }

  public some(predicate: BinaryPredicate<StatsValue, AsOf>): boolean {
    return this.vals.some(predicate);
  }

  public toJSON(): Array<StatsValueJSON> {
    const json: Array<StatsValueJSON> = [];

    this.vals.forEach((value: StatsValue) => {
      json.push(value.toJSON());
    });

    return json;
  }

  public values(): Iterable<StatsValue> {
    return this.vals.values();
  }
}
