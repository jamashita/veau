import { UnimplementedError } from '@jamashita/anden-error';
import { Objet } from '@jamashita/anden-object';
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
