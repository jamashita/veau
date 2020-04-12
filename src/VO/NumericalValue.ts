import { ValueObject } from '../General/ValueObject';

export class NumericalValue extends ValueObject {
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

  public toString(): string {
    return `${this.value}`;
  }
}
