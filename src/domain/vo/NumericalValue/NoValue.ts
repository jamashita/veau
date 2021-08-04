import { NumericalValueError } from './error/NumericalValueError.js';
import { NumericalValue } from './NumericalValue.js';

export class NoValue extends NumericalValue {
  private static readonly INSTANCE: NoValue = new NoValue();

  public static override of(): NoValue {
    return NoValue.INSTANCE;
  }

  protected constructor() {
    super(NaN);
  }

  public override serialize(): string {
    return '';
  }

  public override get(): never {
    throw new NumericalValueError('ILLEGAL OPERATION');
  }
}
