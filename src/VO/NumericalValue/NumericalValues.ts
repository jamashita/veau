import { BinaryPredicate, Enumerator, Mapper, Nullable } from '@jamashita/anden-type';
import { Collection, ImmutableSequence, Quantity, ReadonlySequence, Sequence } from '@jamashita/lluvia-collection';
import { NumericalValue } from './NumericalValue';

export class NumericalValues extends Quantity<number, NumericalValue, 'NumericalValues'> {
  public readonly noun: 'NumericalValues' = 'NumericalValues';
  private readonly vals: Sequence<NumericalValue>;

  private static readonly EMPTY: NumericalValues = new NumericalValues(ImmutableSequence.empty<NumericalValue>());

  public static of(values: ReadonlySequence<NumericalValue>): NumericalValues {
    return NumericalValues.ofArray(values.toArray());
  }

  public static ofArray(values: ReadonlyArray<NumericalValue>): NumericalValues {
    if (values.length === 0) {
      return NumericalValues.empty();
    }

    return new NumericalValues(ImmutableSequence.ofArray<NumericalValue>(values));
  }

  public static ofSpread(...values: Array<NumericalValue>): NumericalValues {
    return NumericalValues.ofArray(values);
  }

  public static empty(): NumericalValues {
    return NumericalValues.EMPTY;
  }

  protected constructor(values: Sequence<NumericalValue>) {
    super();
    this.vals = values;
  }

  public get(index: number): Nullable<NumericalValue> {
    return this.vals.get(index);
  }

  public contains(value: NumericalValue): boolean {
    return this.vals.contains(value);
  }

  public size(): number {
    return this.vals.size();
  }

  public forEach(iteration: Enumerator<number, NumericalValue>): void {
    this.vals.forEach(iteration);
  }

  public isEmpty(): boolean {
    return this.vals.isEmpty();
  }

  public equals(other: NumericalValues): boolean {
    if (this === other) {
      return true;
    }

    return this.vals.equals(other.vals);
  }

  public serialize(): string {
    return this.vals.toString();
  }

  public every(predicate: BinaryPredicate<NumericalValue, number>): boolean {
    return this.vals.every(predicate);
  }

  public some(predicate: BinaryPredicate<NumericalValue, number>): boolean {
    return this.vals.some(predicate);
  }

  public values(): Iterable<NumericalValue> {
    return this.vals.values();
  }

  public iterator(): Iterator<[number, NumericalValue]> {
    return this.vals[Symbol.iterator]();
  }

  public filter(predicate: BinaryPredicate<NumericalValue, number>): Collection<number, NumericalValue> {
    return this.vals.filter(predicate);
  }

  public find(predicate: BinaryPredicate<NumericalValue, number>): Nullable<NumericalValue> {
    return this.vals.find(predicate);
  }

  public map<W>(mapper: Mapper<NumericalValue, W>): Sequence<W> {
    return this.vals.map<W>(mapper);
  }

  public add(value: NumericalValue): NumericalValues {
    return NumericalValues.of(this.vals.add(value));
  }

  public row(): Array<string> {
    return this.vals.toArray().map<string>((value: NumericalValue) => {
      return value.toString();
    });
  }
}
