import { UnimplementedError } from '@jamashita/publikum-error';
import { Objet } from '@jamashita/publikum-object';
import { NumericalValue } from '../NumericalValue';

export class MockNumericalValue extends Objet<'ValueContained'> implements NumericalValue {
  public readonly noun: 'ValueContained' = 'ValueContained';

  public constructor() {
    super();
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    return 'MOCK NUMERICAL VALUE';
  }
}
