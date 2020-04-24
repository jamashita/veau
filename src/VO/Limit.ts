import { Alive, Dead, Kind, Superposition, ValueObject } from 'publikum';
import { LimitError } from '../Error/LimitError';

const DEFAULT_VALUE: number = 40;

export class Limit extends ValueObject {
  public readonly noun: 'Limit' = 'Limit';
  private readonly limit: number;

  private static readonly DEFAULT: Limit = new Limit(DEFAULT_VALUE);

  public static of(limit: number): Superposition<Limit, LimitError> {
    if (limit <= 0) {
      return Dead.of<Limit, LimitError>(new LimitError(`ILLEGAL LIMIT SPECIFIED ${limit}`));
    }
    if (limit === DEFAULT_VALUE) {
      return Alive.of<Limit, LimitError>(Limit.default());
    }
    if (Kind.isInteger(limit)) {
      return Alive.of<Limit, LimitError>(new Limit(limit));
    }

    return Dead.of<Limit, LimitError>(new LimitError('ILLEGAL LIMIT SPECIFIED'));
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
