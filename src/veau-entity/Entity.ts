import { Identifier } from '../veau-general/Identifier';

export abstract class Entity<T extends Identifier> {

  public abstract getIdentifier(): T;

  public abstract toJSON(): any;

  public abstract toString(): string;

  public abstract copy(): Entity<T>;

  public equals(other: Entity<T>): boolean {
    if (this === other) {
      return true;
    }
    if (this.getIdentifier().equals(other.getIdentifier())) {
      return true;
    }

    return false;
  }
}
