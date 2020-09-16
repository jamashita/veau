import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/publikum-collection';
import { BinaryPredicate, Nullable } from '@jamashita/publikum-type';
import { INumericalValue } from './INumericalValue';

export class NumericalValues extends Quantity<NumericalValues, number, INumericalValue, 'NumericalValues'> {
  public readonly noun: 'NumericalValues' = 'NumericalValues';
  private readonly values: Sequence<INumericalValue>;

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
    this.values = values;
  }

  public get(index: number): Nullable<INumericalValue> {
    return this.values.get(index);
  }

  public contains(value: INumericalValue): boolean {
    return this.values.contains(value);
  }

  public size(): number {
    return this.values.size();
  }

  public forEach(iteration: CancellableEnumerator<number, INumericalValue>): void {
    this.values.forEach(iteration);
  }

  public isEmpty(): boolean {
    return this.values.isEmpty();
  }

  public equals(other: NumericalValues): boolean {
    if (this === other) {
      return true;
    }

    return this.values.equals(other.values);
  }

  public serialize(): string {
    return this.values.toString();
  }

  public [Symbol.iterator](): Iterator<Pair<number, INumericalValue>> {
    return this.values[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<INumericalValue, number>): boolean {
    return this.values.every(predicate);
  }

  public some(predicate: BinaryPredicate<INumericalValue, number>): boolean {
    return this.values.some(predicate);
  }

  public add(...values: ReadonlyArray<INumericalValue>): NumericalValues {
    if (values.length === 0) {
      return this;
    }

    return NumericalValues.of(this.values.add(...values));
  }

  public row(): Array<string> {
    return this.values.toArray().map<string>((value: INumericalValue) => {
      return value.toString();
    });
  }
}
