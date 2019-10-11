import { Identifier } from '../veau-general/Identifier';
import { JSONable } from '../veau-general/JSONable';
import { Serializable } from '../veau-general/Serializable';
import { JSON } from '../veau-general/Type/JSON';

export abstract class Entity<T extends Identifier> implements JSONable, Serializable {

  public abstract getIdentifier(): T;

  public abstract toJSON(): JSON;

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
