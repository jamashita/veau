import { UnimplementedError } from '@jamashita/publikum-error';
import { Objet } from '@jamashita/publikum-object';
import { NumericalValue } from '../NumericalValue';

export class MockNumericalValue extends Objet<'ValueContained'> implements NumericalValue {
  public readonly noun: 'ValueContained' = 'ValueContained';

  public constructor() {
    super();
  }

  public get(): number {
    throw new UnimplementedError();
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
