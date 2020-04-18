import hash from 'object-hash';
import { Nominative } from '../Interface/Nominative';

export abstract class Objet implements Nominative {
  public abstract readonly noun: string;

  protected constructor() {
  }

  public abstract equals(other: Objet): boolean;

  public abstract serialize(): string;

  protected innerHashCode(objet: Nominative): string {
    return hash(objet);
  }

  public hashCode(): string {
    return this.innerHashCode(this);
  }

  public toString(): string {
    return this.serialize();
  }
}
