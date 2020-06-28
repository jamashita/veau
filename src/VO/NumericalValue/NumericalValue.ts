import { ValueObject } from '@jamashita/publikum-object';

export class NumericalValue extends ValueObject<NumericalValue, 'NumericalValue'> {
  public readonly noun: 'NumericalValue' = 'NumericalValue';
  private readonly value: number;

  public static of(value: number): NumericalValue {
    return new NumericalValue(value);
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
    if (this.value === other.value) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.value}`;
  }
}
