import { LoadingCountError } from '../veau-error/LoadingCountError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

const DEFAULT_COUNT: number = 0;

export class LoadingCount extends ValueObject {
  public readonly noun: 'LoadingCount' = 'LoadingCount';
  private readonly count: number;

  private static readonly DEFAULT: LoadingCount = new LoadingCount(DEFAULT_COUNT);

  public static of(count: number): Try<LoadingCount, LoadingCountError> {
    if (count < 0) {
      return Failure.of<LoadingCount, LoadingCountError>(new LoadingCountError(`ILLEGAL COUNT SPECIFIED ${count}`));
    }
    if (Type.isInteger(count)) {
      return Success.of<LoadingCount, LoadingCountError>(new LoadingCount(count));
    }

    return Failure.of<LoadingCount, LoadingCountError>(new LoadingCountError(`ILLEGAL COUNT SPECIFIED`));
  }

  public static default(): LoadingCount {
    return LoadingCount.DEFAULT;
  }

  protected constructor(count: number) {
    super();
    this.count = count;
  }

  public get(): number {
    return this.count;
  }

  public isLoading(): boolean {
    if (this.count === 0) {
      return false;
    }

    return true;
  }

  public increment(): LoadingCount {
    return new LoadingCount(this.count + 1);
  }

  public decrement(): LoadingCount {
    const {
      count
    } = this;

    if (count === 0) {
      return new LoadingCount(0);
    }

    return new LoadingCount(this.count - 1);
  }

  public equals(other: LoadingCount): boolean {
    if (this === other) {
      return true;
    }
    if (this.count === other.count) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return `${this.count}`;
  }
}
