import { ValueObject } from '@jamashita/publikum-object';
import { INumericalValue } from './INumericalValue';

export class NumericalValue extends ValueObject<INumericalValue<'NumericalValue'>, 'NumericalValue'> implements INumericalValue<'NumericalValue'> {
  public readonly noun: 'NumericalValue' = 'NumericalValue';
  private readonly value: number;

  public static of(value: number): NumericalValue {
    return new NumericalValue(value);
  }

  protected constructor(value: number) {
    super();
    this.value = value;
  }

  public equals(other: INumericalValue): boolean {
    if (this === other) {
      return true;
    }
    if (other instanceof NumericalValue) {
      if (this.value === other.value) {
        return true;
      }
    }

    return false;
  }

  public serialize(): string {
    return `${this.value}`;
  }

  public get(): number {
    return this.value;
  }
}
