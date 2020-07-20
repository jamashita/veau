import { CancellableEnumerator, ImmutableSequence, Pair, Quantity, Sequence } from '@jamashita/publikum-collection';
import { Nullable } from '@jamashita/publikum-type';

import { NumericalValue } from './NumericalValue';

export class NumericalValues extends Quantity<NumericalValues, number, NumericalValue, 'NumericalValues'> {
  public readonly noun: 'NumericalValues' = 'NumericalValues';
  private readonly values: Sequence<NumericalValue>;
  private static readonly EMPTY: NumericalValues = new NumericalValues(ImmutableSequence.empty<NumericalValue>());

  public static of(values: Sequence<NumericalValue>): NumericalValues {
    if (values.isEmpty()) {
      return NumericalValues.empty();
    }

    return new NumericalValues(values);
  }

  public static ofArray(values: Array<NumericalValue>): NumericalValues {
    return NumericalValues.of(ImmutableSequence.of<NumericalValue>(values));
  }

  public static ofSpread(...values: Array<NumericalValue>): NumericalValues {
    return NumericalValues.ofArray(values);
  }

  public static empty(): NumericalValues {
    return NumericalValues.EMPTY;
  }

  protected constructor(values: Sequence<NumericalValue>) {
    super();
    this.values = values;
  }

  public get(index: number): Nullable<NumericalValue> {
    return this.values.get(index);
  }

  public contains(value: NumericalValue): boolean {
    return this.values.contains(value);
  }

  public size(): number {
    return this.values.size();
  }

  public forEach(iteration: CancellableEnumerator<number, NumericalValue>): void {
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

  public add(...values: Array<NumericalValue>): NumericalValues {
    if (values.length === 0) {
      return this;
    }

    return NumericalValues.of(this.values.add(...values));
  }

  public row(): Array<string> {
    return this.values.toArray().map<string>((value: NumericalValue) => {
      return value.toString();
    });
  }

  public iterator(): Iterator<Pair<number, NumericalValue>> {
    return this.values.iterator();
  }
}
