import { LimitError } from '../veau-error/LimitError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

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
