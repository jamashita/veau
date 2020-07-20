import { NumericalValueError } from './Error/NumericalValueError';
import { NumericalValue } from './NumericalValue';

export class NoValue extends NumericalValue {
  private static readonly INSTANCE: NoValue = new NoValue();

  protected constructor() {
    super(0);
  }

  public static of(): NoValue {
    return NoValue.INSTANCE;
  }

  public get(): never {
    throw new NumericalValueError('ILLEGAL OPERATION');
  }

  public equals(other: NumericalValue): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return '';
  }
}
