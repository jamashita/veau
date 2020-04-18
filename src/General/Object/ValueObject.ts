import { Objet } from './Objet';

export abstract class ValueObject extends Objet {
  public abstract readonly noun: string;
  private code?: string;

  public abstract equals(other: ValueObject): boolean;

  public hashCode(): string {
    if (this.code !== undefined) {
      return this.code;
    }

    this.code = super.hashCode();

    return this.code;
  }

  public abstract serialize(): string;
}
