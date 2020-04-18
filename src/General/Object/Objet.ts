import hash from 'object-hash';
import { Nominative } from '../Interface/Nominative';

export abstract class Objet implements Nominative {
  public abstract readonly noun: string;

  protected constructor() {
  }

  public abstract equals(other: Objet): boolean;

  public hashCode(): string {
    return hash(this);
  }

  protected abstract serialize(): string;

  public toString(): string {
    return this.serialize();
  }
}
