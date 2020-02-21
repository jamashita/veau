import { LimitError } from '../veau-error/LimitError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

export class Limit extends ValueObject {
  private limit: number;

  public static of(limit: number): Limit {
    if (limit <= 0) {
      throw new LimitError(`ILLEGAL LIMIT SPECIFIED ${limit.toString()}`);
    }
    if (Type.isInteger(limit)) {
      return new Limit(limit);
    }

    throw new LimitError('ILLEGAL LIMIT SPECIFIED');
  }

  private constructor(limit: number) {
    super();
    this.limit = limit;
  }

  public get(): number {
    return this.limit;
  }

  public equals(other: Limit): boolean {
    if (this === other) {
      return true;
    }
    if (this.limit === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.limit.toString();
  }
}
