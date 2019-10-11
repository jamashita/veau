import { Identifier } from '../veau-general/Identifier';
import { Serializable } from '../veau-general/Serializable';

export abstract class ValueObject implements Identifier, Serializable {

  public abstract equals(other: ValueObject): boolean;

  public abstract toString(): string;
}
