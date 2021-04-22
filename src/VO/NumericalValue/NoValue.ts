import { ValueObject } from '@jamashita/anden-object';
import { NumericalValueError } from './Error/NumericalValueError';
import { NumericalValue } from './NumericalValue';

export class NoValue extends ValueObject<'NoValue'> implements NumericalValue<'NoValue'> {
  public readonly noun: 'NoValue' = 'NoValue';

  private static readonly INSTANCE: NoValue = new NoValue();

  public static of(): NoValue {
    return NoValue.INSTANCE;
  }

  protected constructor() {
    super();
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
