import { ValueObject } from '@jamashita/publikum-object';
import { NumericalValueError } from './Error/NumericalValueError';
import { INumericalValue } from './INumericalValue';

export class NoValue extends ValueObject<INumericalValue<'NoValue'>, 'NoValue'> implements INumericalValue<'NoValue'> {
  public readonly noun: 'NoValue' = 'NoValue';

  private static readonly INSTANCE: NoValue = new NoValue();

  public static of(): NoValue {
    return NoValue.INSTANCE;
  }

  protected constructor() {
    super();
  }

  public equals(other: INumericalValue): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return '';
  }

  public get(): never {
    throw new NumericalValueError('ILLEGAL OPERATION');
  }
}
