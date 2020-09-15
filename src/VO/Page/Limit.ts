import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';
import { PageError } from './Error/PageError';

const DEFAULT_VALUE: number = 40;

export class Limit extends ValueObject<Limit, 'Limit'> {
  public readonly noun: 'Limit' = 'Limit';
  private readonly limit: number;
  private static readonly DEFAULT: Limit = new Limit(DEFAULT_VALUE);

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

    throw new PageError(`ILLEGAL LIMIT SPECIFIED: ${Kind.notate(limit)}`);
  }

  public static default(): Limit {
    return Limit.DEFAULT;
  }

  protected constructor(limit: number) {
    super();
    this.limit = limit;
  }

  public equals(other: Limit): boolean {
    if (this === other) {
      return true;
    }
    if (this.limit === other.limit) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.limit}`;
  }

  public get(): number {
    return this.limit;
  }
}
