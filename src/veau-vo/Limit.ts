import { RuntimeError } from '../veau-error/RuntimeError';
import { ValueObject } from './ValueObject';

export class Limit extends ValueObject {
  private limit: number;

  public static of(limit: number): Limit {
    if (limit <= 0) {
      throw new RuntimeError(`ILLEGAL LIMIT SPECIFIED ${limit}`);
    }

    return new Limit(limit);
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
