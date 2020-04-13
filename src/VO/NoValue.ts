import { NumericalValueError } from '../Error/NumericalValueError';
import { NumericalValue } from './NumericalValue';

export class NoValue extends NumericalValue {
  private static readonly INSTANCE: NoValue = new NoValue();

  public static of(): NoValue {
    return NoValue.INSTANCE;
  }

  protected constructor() {
    super(0);
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

  public toString(): string {
    return '';
  }
}
