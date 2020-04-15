import { BiFunction } from '../Type/Function';
import { Failure } from './Failure';
import { Try } from './Try';

export class Success<S, F extends Error> extends Try<S, F> {
  public readonly noun: 'Success' = 'Success';
  private readonly value: S;

  public static of<F extends Error>(): Success<void, F>;
  public static of<S, F extends Error>(value: S): Success<S, F>;
  public static of<S, F extends Error>(value?: S): Success<void, F> | Success<S, F> {
    if (value === undefined) {
      return new Success<void, F>(undefined);
    }

    return new Success<S, F>(value);
  }

  private constructor(value: S) {
    super();
    this.value = value;
  }

  public get(): S {
    return this.value;
  }

  public isSuccess(): this is Success<S, F> {
    return true;
  }

  public match<T>(success: BiFunction<S, Success<S, F>, T>, failure: BiFunction<F, Failure<S, F>, T>): T;
  public match<T>(success: BiFunction<S, Success<S, F>, Promise<T>>, failure: BiFunction<F, Failure<S, F>, Promise<T>>): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public match<T>(success: BiFunction<S, Success<S, F>, T> | BiFunction<S, Success<S, F>, Promise<T>>, failure: BiFunction<F, Failure<S, F>, T> | BiFunction<F, Failure<S, F>, Promise<T>>): T | Promise<T> {
    return success(this.value, this);
  }

  public transpose<E extends Error>(): Success<S, E> {
    return this as never as Success<S, E>;
  }
}
