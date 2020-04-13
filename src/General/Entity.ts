import { Cloneable } from './Interface/Cloneable';
import { Equalable } from './Interface/Equalable';
import { JSONable } from './Interface/JSONable';
import { Nominative } from './Interface/Nominative';
import { JSObjectNotation } from './Type/Value';

export abstract class Entity<T extends Equalable> implements JSONable, Nominative, Cloneable {
  public abstract readonly noun: string;

  public abstract getIdentifier(): T;

  public abstract toJSON(): JSObjectNotation;

  public abstract toString(): string;

  public abstract copy(): ThisType<T>;

  public equals(other: this): boolean {
    if (this === other) {
      return true;
    }
    if (this.getIdentifier().equals(other.getIdentifier())) {
      return true;
    }

    return false;
  }
}
