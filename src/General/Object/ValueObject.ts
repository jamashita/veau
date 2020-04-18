import { Objet } from './Objet';

export abstract class ValueObject extends Objet {
  public abstract readonly noun: string;

  public abstract equals(other: ValueObject): boolean;

  public abstract serialize(): string;
}
