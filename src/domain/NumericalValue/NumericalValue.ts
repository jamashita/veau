import { ValueObject } from '@jamashita/anden-object';

export class NumericalValue extends ValueObject {
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

    return this.value === other.value;
  }

  public get(): number {
    return this.value;
  }

  public serialize(): string {
    return `${this.value}`;
  }
}
