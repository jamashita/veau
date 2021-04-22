import { ValueObject } from '@jamashita/anden-object';
import { NumericalValue } from './NumericalValue';

export class ValueContained extends ValueObject<'ValueContained'> implements NumericalValue<'ValueContained'> {
  public readonly noun: 'ValueContained' = 'ValueContained';
  private readonly value: number;

  public static of(value: number): ValueContained {
    return new ValueContained(value);
  }

  protected constructor(value: number) {
    super();
    this.value = value;
  }

  public get(): number {
    return this.value;
  }

  public equals(other: NumericalValue): boolean {
    if (this === other) {
      return true;
    }
    if (other instanceof ValueContained) {
      if (this.value === other.value) {
        return true;
      }
    }

    return false;
  }

  public serialize(): string {
    return `${this.value}`;
  }
}
