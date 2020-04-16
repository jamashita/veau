import { ImmutableSequence } from '../General/Collection/Sequence/ImmutableSequence';
import { Sequence } from '../General/Collection/Sequence/Interface/Sequence';
import { Collection } from '../General/Interface/Collection';
import { Quantum } from '../General/Quantum/Quantum';
import { NumericalValue } from './NumericalValue';

export class NumericalValues implements Collection<number, NumericalValue> {
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
    this.values = values;
  }

  public add(...values: Array<NumericalValue>): NumericalValues {
    return NumericalValues.of(this.values.add(...values));
  }

  public get(index: number): Quantum<NumericalValue> {
    return this.values.get(index);
  }

  public row(): Array<string> {
    return this.values.toArray().map<string>((value: NumericalValue) => {
      return value.toString();
    });
  }

  public contains(value: NumericalValue): boolean {
    return this.values.contains(value);
  }

  public size(): number {
    return this.values.size();
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

  public toString(): string {
    return this.row().join(', ');
  }
}
