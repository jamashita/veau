import { RuntimeError } from '../veau-general/RuntimeError';
import { NumericalValue } from './NumericalValue';

export class NoValue extends NumericalValue {

  public static of(): NoValue {
    return new NoValue();
  }

  private constructor() {
    super(0);
  }

  public get(): number {
    throw new RuntimeError('ILLEGAL OPERATION');
  }

  public getString(): string {
    return '';
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
    return 'NO VALUE';
  }
}
