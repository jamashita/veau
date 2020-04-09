import { BiFunction, MonoFunction } from '../Type/Function';
import { Failure } from './Failure';
import { Try } from './Try';

export class Success<S, F extends Error> extends Try<S, F> {
  public readonly noun: 'Success' = 'Success';
  private readonly value: S;

  public static of<S, F extends Error>(value: S): Success<S, F> {
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

  public isFailure(): this is Failure<S, F> {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public match<T>(success: MonoFunction<S, T>, failure: MonoFunction<F, T>): T {
    return success(this.value);
  }

  public complete<T = S, E extends Error = F>(success: BiFunction<S, Success<S, F>, T | Try<T, F | E>>): Try<S | T, F | E> {
    const recovery: T | Try<T, F | E> = success(this.value, this);

    if (recovery instanceof Try) {
      return recovery;
    }

    return Success.of<T, F>(recovery);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public recover<T = S, E extends Error = F>(failure: BiFunction<F, Failure<S, F>, T | Try<T, F | E>>): Try<S | T, F | E> {
    return this;
  }

  public transpose<E extends Error>(): Success<S, E> {
    return this as never as Success<S, E>;
  }
}
