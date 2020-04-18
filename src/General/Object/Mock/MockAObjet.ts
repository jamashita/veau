import { UnimplementedError } from '../../UnimplementedError';
import { Objet } from '../Objet';

export class MockAObjet<T> extends Objet {
  public readonly noun: 'MockAObjet' = 'MockAObjet';
  private value: T;

  public constructor(value: T) {
    super();
    this.value = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public equals(other: MockAObjet<T>): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
