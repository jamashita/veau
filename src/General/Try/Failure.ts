import { BiFunction } from '../Type/Function';
import { Success } from './Success';
import { Try } from './Try';

export class Failure<S, F extends Error> extends Try<S, F> {
  public readonly noun: 'Failure' = 'Failure';
  private readonly value: F;

  public static of<F extends Error>(value: F): Failure<void, F>;
  public static of<S, F extends Error>(value: F): Failure<S, F>;
  public static of<S, F extends Error>(value: F): Failure<void, F> | Failure<S, F> {
    return new Failure<S, F>(value);
  }

  private constructor(value: F) {
    super();
    this.value = value;
  }

  public get(): never {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.value as Error;
  }

  public getError(): F {
    return this.value;
  }

  public isFailure(): this is Failure<S, F> {
    return true;
  }

  public match<T>(success: BiFunction<S, Success<S, F>, T>, failure: BiFunction<F, Failure<S, F>, T>): T;
  public match<T>(success: BiFunction<S, Success<S, F>, Promise<T>>, failure: BiFunction<F, Failure<S, F>, Promise<T>>): Promise<T>;
  public match<T, E extends Error>(success: BiFunction<S, Success<S, F>, Try<T, E>>, failure: BiFunction<F, Failure<S, F>, Try<T, E>>): Try<T, E>;
  public match<T, E extends Error>(success: BiFunction<S, Success<S, F>, Promise<Try<T, E>>>, failure: BiFunction<F, Failure<S, F>, Promise<Try<T, E>>>): Promise<Try<T, E>>;
  public match<T, E extends Error = F>(
    success: BiFunction<S, Success<S, F>, T> | BiFunction<S, Success<S, F>, Promise<T>> | BiFunction<S, Success<S, F>, Try<T, E>> | BiFunction<S, Success<S, F>, Promise<Try<T, E>>>,
    failure: BiFunction<F, Failure<S, F>, T> | BiFunction<F, Failure<S, F>, Promise<T>> | BiFunction<F, Failure<S, F>, Try<T, E>> | BiFunction<F, Failure<S, F>, Promise<Try<T, E>>>
  ): T | Promise<T> | Try<T, E> | Promise<Try<T, E>> {
    return failure(this.value, this);
  }

  public transpose<T>(): Failure<T, F> {
    return this as never as Failure<T, F>;
  }
}
