import { Equalable } from './Equalable';
import { Identifier } from './Identifier';
import { JSONable } from './JSONable';
import { Serializable } from './Serializable';
import { JSON } from './Type/JSON';

export abstract class Entity<T extends Identifier> implements JSONable, Serializable, Equalable {

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
