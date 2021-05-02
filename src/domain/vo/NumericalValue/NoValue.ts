import { NumericalValueError } from './error/NumericalValueError';
import { NumericalValue } from './NumericalValue';

export class NoValue extends NumericalValue {
  private static readonly INSTANCE: NoValue = new NoValue();

  protected constructor() {
    super(NaN);
  }

  public get(): never {
    throw new NumericalValueError('ILLEGAL OPERATION');
  }

  public static of(): NoValue {
    return NoValue.INSTANCE;
  }

  public serialize(): string {
    return '';
  }
}
