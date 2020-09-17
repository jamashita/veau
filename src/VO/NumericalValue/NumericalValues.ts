import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/publikum-collection';
import { BinaryPredicate, Nullable } from '@jamashita/publikum-type';
import { INumericalValue } from './INumericalValue';

export class NumericalValues extends Quantity<NumericalValues, number, INumericalValue, 'NumericalValues'> {
  public readonly noun: 'NumericalValues' = 'NumericalValues';
  private readonly vals: Sequence<INumericalValue>;

  private static readonly EMPTY: NumericalValues = new NumericalValues(ImmutableSequence.empty<INumericalValue>());

  public static of(values: Sequence<INumericalValue>): NumericalValues {
    if (values.isEmpty()) {
      return NumericalValues.empty();
    }

    return new NumericalValues(values);
  }

  public static ofArray(values: Array<INumericalValue>): NumericalValues {
    return NumericalValues.of(ImmutableSequence.of<INumericalValue>(values));
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

  public forEach(iteration: CancellableEnumerator<number, INumericalValue>): void {
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

  public [Symbol.iterator](): Iterator<Pair<number, INumericalValue>> {
    return this.vals[Symbol.iterator]();
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

  public add(value: INumericalValue): NumericalValues {
    return NumericalValues.of(this.vals.add(value));
  }

  public row(): Array<string> {
    return this.vals.toArray().map<string>((value: INumericalValue) => {
      return value.toString();
    });
  }
}
