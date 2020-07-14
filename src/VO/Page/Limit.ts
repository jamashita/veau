import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { LimitError } from './Error/LimitError';

const DEFAULT_VALUE: number = 40;

export class Limit extends ValueObject<Limit, 'Limit'> {
  public readonly noun: 'Limit' = 'Limit';
  private readonly limit: number;

  private static readonly DEFAULT: Limit = new Limit(DEFAULT_VALUE);

  public static of(limit: number): Superposition<Limit, LimitError> {
    if (limit <= 0) {
      return Superposition.dead<Limit, LimitError>(
        new LimitError(`ILLEGAL LIMIT SPECIFIED ${limit}`),LimitError
      );
    }
    if (limit === DEFAULT_VALUE) {
      return Superposition.alive<Limit, LimitError>(Limit.default(), LimitError);
    }
    if (Kind.isInteger(limit)) {
      return Superposition.alive<Limit, LimitError>(new Limit(limit), LimitError);
    }

    return Superposition.dead<Limit, LimitError>(
      new LimitError('ILLEGAL LIMIT SPECIFIED'), LimitError
    );
  }

  public static default(): Limit {
    return Limit.DEFAULT;
  }

  protected constructor(limit: number) {
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
    if (this.limit === other.limit) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.limit}`;
  }
}
