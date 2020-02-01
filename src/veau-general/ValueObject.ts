import { Nominative } from './Nominative';

export abstract class ValueObject implements Nominative {

  public abstract equals(other: ValueObject): boolean;

  public abstract toString(): string;
}
