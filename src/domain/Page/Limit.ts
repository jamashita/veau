import { ValueObject } from '@jamashita/anden-object';
import { Kind } from '@jamashita/anden-type';
import { PageError } from './PageError';

const DEFAULT_VALUE: number = 40;

export class Limit extends ValueObject {
  private readonly limit: number;

  private static readonly DEFAULT: Limit = new Limit(DEFAULT_VALUE);

  public static default(): Limit {
    return Limit.DEFAULT;
  }

  public static of(limit: number): Limit {
    if (limit <= 0) {
      throw new PageError(`ILLEGAL LIMIT SPECIFIED ${limit}`);
    }
    if (limit === DEFAULT_VALUE) {
      return Limit.default();
    }
    if (Kind.isInteger(limit)) {
      return new Limit(limit);
    }

    throw new PageError(`ILLEGAL LIMIT SPECIFIED: ${limit}`);
  }

  protected constructor(limit: number) {
    super();
    this.limit = limit;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Limit)) {
      return false;
    }

    return this.limit === other.limit;
  }

  public serialize(): string {
    return `${this.limit}`;
  }

  public get(): number {
    return this.limit;
  }
}
