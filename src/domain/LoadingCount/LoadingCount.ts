import { ValueObject } from '@jamashita/anden-object';
import { Kind } from '@jamashita/anden-type';
import { LoadingCountError } from './LoadingCountError.js';

const DEFAULT_COUNT: number = 0;

export class LoadingCount extends ValueObject {
  private readonly count: number;

  private static readonly DEFAULT: LoadingCount = new LoadingCount(DEFAULT_COUNT);

  public static default(): LoadingCount {
    return LoadingCount.DEFAULT;
  }

  public static of(count: number): LoadingCount {
    if (count < 0) {
      throw new LoadingCountError(`ILLEGAL COUNT SPECIFIED ${count}`);
    }
    if (count === DEFAULT_COUNT) {
      return LoadingCount.default();
    }
    if (Kind.isInteger(count)) {
      return new LoadingCount(count);
    }

    throw new LoadingCountError(`ILLEGAL COUNT SPECIFIED: ${count}`);
  }

  protected constructor(count: number) {
    super();
    this.count = count;
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

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof LoadingCount)) {
      return false;
    }

    return this.count === other.count;
  }

  public get(): number {
    return this.count;
  }

  public increment(): LoadingCount {
    return new LoadingCount(this.count + 1);
  }

  public isLoading(): boolean {
    return this.count !== 0;
  }

  public serialize(): string {
    return `${this.count}`;
  }
}
