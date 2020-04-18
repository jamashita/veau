import { UnimplementedError } from '../../UnimplementedError';
import { Objet } from '../Abstract/Objet';

export class AObjet<T> extends Objet {
  public readonly noun: 'AObjet' = 'AObjet';
  private value: T;

  public constructor(value: T) {
    super();
    this.value = value;
  }

  public duplicate(): AObjet {
    throw new UnimplementedError();
  }

  public equals(other: Objet): boolean {
    throw new UnimplementedError();
  }

  protected serialize(): string {
    throw new UnimplementedError();
  }
}
