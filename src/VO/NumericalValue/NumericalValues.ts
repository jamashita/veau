import { Collection, ImmutableSequence, Quantity, ReadonlySequence, Sequence } from '@jamashita/publikum-collection';
import { BinaryPredicate, Enumerator, Mapper, Nullable } from '@jamashita/publikum-type';
import { INumericalValue } from './INumericalValue';

export class NumericalValues extends Quantity<number, INumericalValue, 'NumericalValues'> {
  public readonly noun: 'NumericalValues' = 'NumericalValues';
  private readonly vals: Sequence<INumericalValue>;

  private static readonly EMPTY: NumericalValues = new NumericalValues(ImmutableSequence.empty<INumericalValue>());

  public static of(values: ReadonlySequence<INumericalValue>): NumericalValues {
    if (values.isEmpty()) {
      return NumericalValues.empty();
    }

    return new NumericalValues(ImmutableSequence.of<INumericalValue>(values));
  }

  public static ofArray(values: ReadonlyArray<INumericalValue>): NumericalValues {
    return NumericalValues.of(ImmutableSequence.ofArray<INumericalValue>(values));
  }

  public static ofSpread(...values: Array<INumericalValue>): NumericalValues {
    return NumericalValues.ofArray(values);
  }

  public static empty(): NumericalValues {
    return NumericalValues.EMPTY;
  }

  protected constructor(values: Sequence<INumericalValue>) {
    super();
    this.vals = values;
  }

  public get(index: number): Nullable<INumericalValue> {
    return this.vals.get(index);
  }

  public contains(value: INumericalValue): boolean {
    return this.vals.contains(value);
  }

  public size(): number {
    return this.vals.size();
  }

  public forEach(iteration: Enumerator<number, INumericalValue>): void {
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

  public every(predicate: BinaryPredicate<INumericalValue, number>): boolean {
    return this.vals.every(predicate);
  }

  public some(predicate: BinaryPredicate<INumericalValue, number>): boolean {
    return this.vals.some(predicate);
  }

  public values(): Iterable<INumericalValue> {
    return this.vals.values();
  }

  public iterator(): Iterator<[number, INumericalValue]> {
    return this.vals[Symbol.iterator]();
  }

  public filter(predicate: BinaryPredicate<INumericalValue, number>): Collection<number, INumericalValue> {
    return this.vals.filter(predicate);
  }

  public find(predicate: BinaryPredicate<INumericalValue, number>): Nullable<INumericalValue> {
    return this.vals.find(predicate);
  }

  public map<W>(mapper: Mapper<INumericalValue, W>): Sequence<W> {
    return this.vals.map<W>(mapper);
  }

  public add(value: INumericalValue): NumericalValues {
    return NumericalValues.of(this.vals.add(value));
  }

  public row(): Array<string> {
    return this.vals.toArray().map<string>((value: INumericalValue) => {
      return value.toString();
    });
  }
}
