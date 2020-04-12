import { NumericalValueError } from '../veau-error/NumericalValueError';
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
    if (other instanceof NoValue) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return '';
  }
}
