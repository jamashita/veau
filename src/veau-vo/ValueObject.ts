import { Identifier } from '../veau-general/Identifier';

export abstract class ValueObject implements Identifier {

  public abstract equals(other: ValueObject): boolean;

  public abstract copy(): ValueObject;

  public abstract toString(): string;
}
