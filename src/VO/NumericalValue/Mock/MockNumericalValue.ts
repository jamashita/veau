import { UnimplementedError } from '@jamashita/anden-error';
import { Objet } from '@jamashita/anden-object';
import { NumericalValue } from '../NumericalValue';

export class MockNumericalValue extends Objet<'ValueContained'> implements NumericalValue {
  public readonly noun: 'ValueContained' = 'ValueContained';
  private v: number;

  public constructor(v: number) {
    super();
    this.v = v;
  }

  public get(): number {
    return this.v;
  }

  public equals(other: MockNumericalValue): boolean {
    return this.v === other.v;
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
