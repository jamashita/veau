import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { LoadingCountError } from './Error/LoadingCountError';

const DEFAULT_COUNT: number = 0;

export class LoadingCount extends ValueObject<LoadingCount, 'LoadingCount'> {
  public readonly noun: 'LoadingCount' = 'LoadingCount';
  private readonly count: number;

  private static readonly DEFAULT: LoadingCount = new LoadingCount(DEFAULT_COUNT);

  public static of(count: number): Superposition<LoadingCount, LoadingCountError> {
    if (count < 0) {
      return Superposition.dead<LoadingCount, LoadingCountError>(
        new LoadingCountError(`ILLEGAL COUNT SPECIFIED ${count}`),
        LoadingCountError
      );
    }
    if (count === DEFAULT_COUNT) {
      return Superposition.alive<LoadingCount, LoadingCountError>(LoadingCount.default(), LoadingCountError);
    }
    if (Kind.isInteger(count)) {
      return Superposition.alive<LoadingCount, LoadingCountError>(new LoadingCount(count), LoadingCountError);
    }

    return Superposition.dead<LoadingCount, LoadingCountError>(
      new LoadingCountError('ILLEGAL COUNT SPECIFIED'),
      LoadingCountError
    );
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
    if (this.count === 1) {
      return LoadingCount.default();
    }
    if (this.count === 0) {
      return LoadingCount.default();
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

  public serialize(): string {
    return `${this.count}`;
  }
}
