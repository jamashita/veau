import { Function } from '../Type/Function';
import { Success } from './Success';
import { Try } from './Try';

export class Failure<S, F extends Error> implements Try<S, F> {
  private value: F;

  public static of<S, F extends Error>(value: F): Failure<S, F> {
    return new Failure<S, F>(value);
  }

  private constructor(value: F) {
    this.value = value;
  }

  public get(): S {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.value as Error;
  }

  public isSuccess(): this is Success<S, F> {
    return false;
  }

  public isFailure(): this is Failure<S, F> {
    return true;
  }

  public complete<T, E extends Error>(success: Function<S, Try<T, E>>, failure: Function<F, Try<T, E>>): Try<T, E> {
    return failure(this.value);
  }

  public match<T>(success: Function<S, T>, failure: Function<F, T>): T {
    return failure(this.value);
  }
}
