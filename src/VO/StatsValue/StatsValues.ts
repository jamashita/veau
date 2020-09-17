import { CancellableEnumerator, ImmutableProject, Pair, Project, Quantity } from '@jamashita/publikum-collection';
import { Cloneable, JSONable } from '@jamashita/publikum-interface';
import { BinaryPredicate, Kind, Nullable } from '@jamashita/publikum-type';
import { AsOf } from '../AsOf/AsOf';
import { AsOfs } from '../AsOf/AsOfs';
import { StatsValue, StatsValueJSON, StatsValueRow } from './StatsValue';

export class StatsValues extends Quantity<StatsValues, AsOf, StatsValue, 'StatsValues'> implements Cloneable<StatsValues>, JSONable<Array<StatsValueJSON>> {
  public readonly noun: 'StatsValues' = 'StatsValues';
  private readonly vals: Project<AsOf, StatsValue>;

  private static readonly EMPTY: StatsValues = new StatsValues(ImmutableProject.empty<AsOf, StatsValue>());

  public static of(values: Project<AsOf, StatsValue>): StatsValues {
    if (values.isEmpty()) {
      return StatsValues.empty();
    }

    return new StatsValues(values);
  }

  public static ofArray(values: Array<StatsValue>): StatsValues {
    const map: Map<AsOf, StatsValue> = new Map<AsOf, StatsValue>();

    values.forEach((value: StatsValue) => {
      map.set(value.getAsOf(), value);
    });

    return StatsValues.ofMap(map);
  }

  public static ofSpread(...values: Array<StatsValue>): StatsValues {
    return StatsValues.ofArray(values);
  }

  public static ofJSON(json: Array<StatsValueJSON>): StatsValues {
    const arr: Array<StatsValue> = json.map<StatsValue>((statsValue: StatsValueJSON) => {
      return StatsValue.ofJSON(statsValue);
    });

    return StatsValues.ofArray(arr);
  }

  public static ofRow(rows: Array<StatsValueRow>): StatsValues {
    const arr: Array<StatsValue> = rows.map<StatsValue>((statsValue: StatsValueRow) => {
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

  public static empty(): StatsValues {
    return StatsValues.EMPTY;
  }

  protected static ofMap(values: Map<AsOf, StatsValue>): StatsValues {
    return StatsValues.of(ImmutableProject.of<AsOf, StatsValue>(values));
  }

  protected constructor(values: Project<AsOf, StatsValue>) {
    super();
    this.vals = values;
  }

  public get(key: AsOf): Nullable<StatsValue> {
    return this.vals.get(key);
  }

  public contains(value: StatsValue): boolean {
    return this.vals.contains(value);
  }

  public size(): number {
    return this.vals.size();
  }

  public forEach(iteration: CancellableEnumerator<AsOf, StatsValue>): void {
    this.vals.forEach(iteration);
  }

  public isEmpty(): boolean {
    return this.vals.isEmpty();
  }

  public duplicate(): StatsValues {
    if (this.isEmpty()) {
      return StatsValues.empty();
    }

    return StatsValues.of(this.vals.duplicate());
  }

  public equals(other: StatsValues): boolean {
    if (this === other) {
      return true;
    }

    return this.vals.equals(other.vals);
  }

  public toJSON(): Array<StatsValueJSON> {
    const json: Array<StatsValueJSON> = [];

    this.vals.forEach((value: StatsValue) => {
      json.push(value.toJSON());
    });

    return json;
  }

  public serialize(): string {
    const strs: Array<string> = [];

    this.vals.forEach((value: StatsValue) => {
      strs.push(value.toString());
    });

    return strs.join(', ');
  }

  public [Symbol.iterator](): Iterator<Pair<AsOf, StatsValue>> {
    return this.vals[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<StatsValue, AsOf>): boolean {
    return this.vals.every(predicate);
  }

  public some(predicate: BinaryPredicate<StatsValue, AsOf>): boolean {
    return this.vals.some(predicate);
  }

  public values(): Iterable<StatsValue> {
    return this.vals.values();
  }

  public set(statsValue: StatsValue): StatsValues {
    return StatsValues.of(this.vals.set(statsValue.getAsOf(), statsValue));
  }

  public delete(asOf: AsOf): StatsValues {
    return StatsValues.of(this.vals.remove(asOf));
  }

  public getAsOfs(): AsOfs {
    return AsOfs.ofArray([...this.vals.toMap().keys()]);
  }
}
