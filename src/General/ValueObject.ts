import { Nominative } from './Interface/Nominative';

export abstract class ValueObject implements Nominative {
  public abstract readonly noun: string;

  public abstract equals(other: ValueObject): boolean;

  public abstract toString(): string;
}
