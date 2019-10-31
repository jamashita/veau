import { Identifier } from './Identifier';
import { Serializable } from './Serializable';

export abstract class ValueObject implements Identifier, Serializable {

  public abstract equals(other: ValueObject): boolean;

  public abstract toString(): string;
}
