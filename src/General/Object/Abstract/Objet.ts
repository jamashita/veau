import hash from 'object-hash';
import { Cloneable } from '../../Interface/Cloneable';
import { Nominative } from '../../Interface/Nominative';

export abstract class Objet implements Cloneable<Objet>, Nominative {
  public abstract readonly noun: string;

  protected constructor() {
  }

  public abstract equals(other: Objet): boolean;

  public abstract duplicate(): Objet;

  public hashCode(): string {
    return hash(this);
  }

  protected abstract serialize(): string;

  public toString(): string {
    return this.serialize();
  }
}
