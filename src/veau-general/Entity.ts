import { Cloneable } from './Cloneable';
import { Equalable } from './Equalable';
import { JSONable } from './JSONable';
import { Nominative } from './Nominative';
import { JSON } from './Type/JSON';

export abstract class Entity<T extends Equalable> implements JSONable, Nominative, Cloneable {

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
