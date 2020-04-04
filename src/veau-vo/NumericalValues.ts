import { Collection } from '../veau-general/Collection';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { NumericalValue } from './NumericalValue';

export class NumericalValues implements Collection<number, NumericalValue> {
  private values: Array<NumericalValue>;

  public static of(values: Array<NumericalValue>): NumericalValues {
    return new NumericalValues(values);
  }

  public static empty(): NumericalValues {
    return NumericalValues.of([
    ]);
  }

  private constructor(values: Array<NumericalValue>) {
    this.values = values;
  }

  public add(value: NumericalValue): NumericalValues {
    const values: Array<NumericalValue> = [
      ...this.values,
      value
    ];

    return NumericalValues.of(values);
  }

  public get(index: number): Optional<NumericalValue> {
    const value: NumericalValue | undefined = this.values[index];

    if (value === undefined) {
      return None.of<NumericalValue>();
    }

    return Some.of<NumericalValue>(value);
  }

  public row(): Array<string> {
    return this.values.map<string>((value: NumericalValue) => {
      return value.toString();
    });
  }

  public contains(value: NumericalValue): boolean {
    const found: NumericalValue | undefined = this.values.find((val: NumericalValue) => {
      return value.equals(val);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.values.length;
  }

  public isEmpty(): boolean {
    if (this.values.length === 0) {
      return true;
    }

    return false;
  }

  public equals(other: NumericalValues): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.values.length;
    if (length !== other.size()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (!this.values[i].equals(other.get(i).get())) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return this.row().join(', ');
  }
}
