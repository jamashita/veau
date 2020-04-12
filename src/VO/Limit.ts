import { LimitError } from '../Error/LimitError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { Type } from '../General/Type/Type';
import { ValueObject } from '../General/ValueObject';

const LIMIT: number = 40;

export class Limit extends ValueObject {
  public readonly noun: 'Limit' = 'Limit';
  private readonly limit: number;

  private static readonly DEFAULT: Limit = new Limit(LIMIT);

  public static of(limit: number): Try<Limit, LimitError> {
    if (limit <= 0) {
      return Failure.of<Limit, LimitError>(new LimitError(`ILLEGAL LIMIT SPECIFIED ${limit}`));
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

  public toString(): string {
    return `${this.limit}`;
  }
}
