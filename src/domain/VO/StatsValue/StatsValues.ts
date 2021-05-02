import { BinaryPredicate, Catalogue, Cloneable, JSONable, Kind, Mapper, Nullable } from '@jamashita/anden-type';
import { ImmutableProject, Quantity, ReadonlyProject } from '@jamashita/lluvia-collection';
import { AsOf } from '../AsOf/AsOf';
import { AsOfs } from '../AsOf/AsOfs';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue';

export class StatsValues extends Quantity<AsOf, StatsValue, 'StatsValues'> implements Cloneable<StatsValues>, JSONable<Array<StatsValueJSON>> {
  public readonly noun: 'StatsValues' = 'StatsValues';
  private readonly vals: ImmutableProject<AsOf, StatsValue>;

  private static readonly EMPTY: StatsValues = new StatsValues(ImmutableProject.empty<AsOf, StatsValue>());

  public static empty(): StatsValues {
    return StatsValues.EMPTY;
  }

  public static of(values: ReadonlyProject<AsOf, StatsValue>): StatsValues {
    return StatsValues.ofMap(values.toMap());
  }

  public static ofArray(values: ReadonlyArray<StatsValue>): StatsValues {
    const map: Map<AsOf, StatsValue> = new Map<AsOf, StatsValue>();

    values.forEach((value: StatsValue) => {
      map.set(value.getAsOf(), value);
    });

    return StatsValues.ofMap(map);
  }

  public static ofJSON(json: ReadonlyArray<StatsValueJSON>): StatsValues {
    const arr: Array<StatsValue> = json.map<StatsValue>((statsValue: StatsValueJSON) => {
      return StatsValue.ofJSON(statsValue);
    });

    return StatsValues.ofArray(arr);
  }

  protected static ofMap(values: ReadonlyMap<AsOf, StatsValue>): StatsValues {
    if (values.size === 0) {
      return StatsValues.empty();
    }

    return new StatsValues(ImmutableProject.ofMap<AsOf, StatsValue>(values));
  }

  public static ofRow(rows: ReadonlyArray<StatsValueRow>): StatsValues {
    const arr: Array<StatsValue> = rows.map<StatsValue>((statsValue: StatsValueRow) => {
      return StatsValue.ofRow(statsValue);
    });

    return StatsValues.ofArray(arr);
  }

  public static ofSpread(...values: Array<StatsValue>): StatsValues {
    return StatsValues.ofArray(values);
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

  public forEach(catalogue: Catalogue<AsOf, StatsValue>): void {
    this.vals.forEach(catalogue);
  }

  public get(key: AsOf): Nullable<StatsValue> {
    return this.vals.get(key);
  }

  public isEmpty(): boolean {
    return this.vals.isEmpty();
  }

  public iterator(): Iterator<[AsOf, StatsValue]> {
    return this.vals[Symbol.iterator]();
  }

  public map<W>(mapper: Mapper<StatsValue, W>): ImmutableProject<AsOf, W> {
    return this.vals.map<W>(mapper);
  }

  public serialize(): string {
    const strs: Array<string> = [];

    this.vals.forEach((value: StatsValue) => {
      strs.push(value.toString());
    });

    return strs.join(', ');
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

  public delete(asOf: AsOf): StatsValues {
    return StatsValues.of(this.vals.remove(asOf));
  }

  public getAsOfs(): AsOfs {
    return AsOfs.ofSpread(...this.vals.toMap().keys());
  }

  public set(statsValue: StatsValue): StatsValues {
    return StatsValues.of(this.vals.set(statsValue.getAsOf(), statsValue));
  }
}
