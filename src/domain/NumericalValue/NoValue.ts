import { NumericalValue } from './NumericalValue.js';
import { NumericalValueError } from './NumericalValueError.js';

export class NoValue extends NumericalValue {
  private static readonly INSTANCE: NoValue = new NoValue();

  public static override of(): NoValue {
    return NoValue.INSTANCE;
  }

  protected constructor() {
    super(NaN);
  }

  public override equals(other: unknown): boolean {
    return this === other;
  }

  public override get(): never {
    throw new NumericalValueError('ILLEGAL OPERATION');
  }

  public override serialize(): string {
    return '';
  }
}
