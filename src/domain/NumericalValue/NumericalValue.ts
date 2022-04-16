import { ValueObject } from '@jamashita/anden-object';

export class NumericalValue extends ValueObject<'NumericalValue'> {
  public readonly noun: 'NumericalValue' = 'NumericalValue';
  private readonly value: number;

  public static of(value: number): NumericalValue {
    return new NumericalValue(value);
  }

  protected constructor(value: number) {
    super();
    this.value = value;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof NumericalValue)) {
      return false;
    }
    if (this.value === other.value) {
      return true;
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
