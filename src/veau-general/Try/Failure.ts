import { Function } from '../Type/Function';
import { Success } from './Success';
import { Try } from './Try';

export class Failure<S, F extends Error> implements Try<S, F> {
  private value: F;

  public static of<S, F extends Error>(value: F): Failure<S, F> {
    return new Failure(value);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public complete<T>(mapper: Function<S, T>): Try<T, F> {
    return Failure.of<T, F>(this.value);
  }

  public recover<E extends Error>(mapper: Function<F, E>): Try<S, E> {
    const result: E = mapper(this.value);

    return Failure.of<S, E>(result);
  }

  public match<T>(success: Function<S, T>, failure: Function<F, T>): T {
    return failure(this.value);
  }
}
