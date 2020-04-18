import { LimitError } from '../Error/LimitError';
import { ValueObject } from '../General/Object/ValueObject';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Type } from '../General/Type/Type';

const DEFAULT_VALUE: number = 40;

export class Limit extends ValueObject {
  public readonly noun: 'Limit' = 'Limit';
  private readonly limit: number;

  private static readonly DEFAULT: Limit = new Limit(DEFAULT_VALUE);

  public static of(limit: number): Superposition<Limit, LimitError> {
    if (limit <= 0) {
      return Failure.of<Limit, LimitError>(new LimitError(`ILLEGAL LIMIT SPECIFIED ${limit}`));
    }
    if (limit === DEFAULT_VALUE) {
      return Success.of<Limit, LimitError>(Limit.default());
    }
    if (Type.isInteger(limit)) {
      return Success.of<Limit, LimitError>(new Limit(limit));
    }

    return Failure.of<Limit, LimitError>(new LimitError('ILLEGAL LIMIT SPECIFIED'));
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

  protected serialize(): string {
    return `${this.limit}`;
  }
}
