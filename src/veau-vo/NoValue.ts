import { NumericalValueError } from '../veau-error/NumericalValueError';
import { NumericalValue } from './NumericalValue';

export class NoValue extends NumericalValue {
  public readonly noun: 'NoValue' = 'NoValue';

  public static of(): NoValue {
    return new NoValue();
  }

  private constructor() {
    super(0);
  }

  public get(): number {
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
