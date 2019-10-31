import { ValueObject } from '../veau-general/ValueObject';

export class NumericalValue extends ValueObject {
  private value: number;

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

  public getString(): string {
    return this.value.toString();
  }

  public equals(other: NumericalValue): boolean {
    if (this === other) {
      return true;
    }
    if (this.value === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.value.toString();
  }
}
