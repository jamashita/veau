import { UnimplementedError } from '../../UnimplementedError';
import { Objet } from '../Abstract/Objet';

export class AObjet<T> extends Objet {
  public readonly noun: 'AObjet' = 'AObjet';
  private value: T;

  public constructor(value: T) {
    super();
    this.value = value;
  }

  public duplicate(): AObjet<T> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public equals(other: AObjet<T>): boolean {
    throw new UnimplementedError();
  }

  protected serialize(): string {
    throw new UnimplementedError();
  }
}
