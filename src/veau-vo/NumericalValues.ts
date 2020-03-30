import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Collection } from '../veau-general/Collection';
import { Enumerator } from '../veau-general/Type/Enumerator';
import { Mapper } from '../veau-general/Type/Mapper';
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

  public get(index: number): NumericalValue {
    const value: NumericalValue | undefined = this.values[index];

    if (value === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return value;
  }

  public row(): Array<string> {
    return this.values.map<string>((value: NumericalValue): string => {
      return value.toString();
    });
  }

  public contains(value: NumericalValue): boolean {
    const found: NumericalValue | undefined = this.values.find((val: NumericalValue): boolean => {
      if (value.equals(val)) {
        return true;
      }

      return false;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.values.length;
  }

  public forEach(iteration: Enumerator<number, NumericalValue>): void {
    this.values.forEach(iteration);
  }

  public isEmpty(): boolean {
    if (this.values.length === 0) {
      return true;
    }

    return false;
  }

  public map<U>(mapper: Mapper<NumericalValue, U>): Array<U> {
    return this.values.map<U>(mapper);
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
      if (!this.values[i].equals(other.get(i))) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return this.row().join(', ');
  }
}
