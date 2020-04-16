import { BiFunction } from '../Type/Function';
import { Success } from './Success';
import { Superposition } from './Superposition';

export class Failure<S, F extends Error> extends Superposition<S, F> {
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
  public match<T, E extends Error>(success: BiFunction<S, Success<S, F>, Superposition<T, E>>, failure: BiFunction<F, Failure<S, F>, Superposition<T, E>>): Superposition<T, E>;
  public match<T, E extends Error>(success: BiFunction<S, Success<S, F>, Promise<Superposition<T, E>>>, failure: BiFunction<F, Failure<S, F>, Promise<Superposition<T, E>>>): Promise<Superposition<T, E>>;
  public match<T, E extends Error = F>(
    success: BiFunction<S, Success<S, F>, T> | BiFunction<S, Success<S, F>, Promise<T>> | BiFunction<S, Success<S, F>, Superposition<T, E>> | BiFunction<S, Success<S, F>, Promise<Superposition<T, E>>>,
    failure: BiFunction<F, Failure<S, F>, T> | BiFunction<F, Failure<S, F>, Promise<T>> | BiFunction<F, Failure<S, F>, Superposition<T, E>> | BiFunction<F, Failure<S, F>, Promise<Superposition<T, E>>>
  ): T | Promise<T> | Superposition<T, E> | Promise<Superposition<T, E>> {
    return failure(this.value, this);
  }

  public transpose<T>(): Failure<T, F> {
    return this as never as Failure<T, F>;
  }
}
