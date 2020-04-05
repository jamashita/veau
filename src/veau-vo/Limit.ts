import { LimitError } from '../veau-error/LimitError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

export class Limit extends ValueObject {
  public readonly noun: 'Limit' = 'Limit';
  private readonly limit: number;

  public static of(limit: number): Try<Limit, LimitError> {
    if (limit <= 0) {
      return Failure.of<Limit, LimitError>(new LimitError(`ILLEGAL LIMIT SPECIFIED ${limit.toString()}`));
    }
    if (Type.isInteger(limit)) {
      return Success.of<Limit, LimitError>(new Limit(limit));
    }

    return Failure.of<Limit, LimitError>(new LimitError('ILLEGAL LIMIT SPECIFIED'));
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
