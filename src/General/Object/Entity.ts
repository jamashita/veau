import { Cloneable } from '../Interface/Cloneable';
import { Equalable } from '../Interface/Equalable';
import { JSONable } from '../Interface/JSONable';
import { JSObjectNotation } from '../Type/Value';
import { Objet } from './Abstract/Objet';

export abstract class Entity<T extends Equalable> extends Objet implements Cloneable<Entity<T>>, JSONable {
  public abstract readonly noun: string;

  public abstract getIdentifier(): T;

  public abstract duplicate(): Entity<T>;

  public abstract toJSON(): JSObjectNotation;

  protected abstract serialize(): string;

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
