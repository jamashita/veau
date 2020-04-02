import { Function } from '../Type/Function';
import { Failure } from './Failure';
import { Try } from './Try';

export class Success<S, F extends Error> implements Try<S, F> {
  private value: S;

  public static of<S, F extends Error>(value: S): Success<S, F> {
    return new Success<S, F>(value);
  }

  private constructor(value: S) {
    this.value = value;
  }

  public get(): S {
    return this.value;
  }

  public isSuccess(): this is Success<S, F> {
    return true;
  }

  public isFailure(): this is Failure<S, F> {
    return false;
  }

  public complete<T>(mapper: Function<S, T>): Try<T, F> {
    const result: T = mapper(this.value);

    return Success.of<T, F>(result);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public recover<E extends Error>(mapper: Function<F, E>): Try<S, E> {
    return Success.of<S, E>(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public match<T>(success: Function<S, T>, failure: Function<F, T>): T {
    return success(this.value);
  }
}
