import { BiFunction } from '../Type/Function';
import { Failure } from './Failure';
import { Success } from './Success';

export abstract class Superposition<S, F extends Error> {
  public abstract readonly noun: 'Success' | 'Failure';

  protected constructor() {
  }

  public abstract get(): S;

  public abstract match<T>(success: BiFunction<S, Success<S, F>, T>, failure: BiFunction<F, Failure<S, F>, T>): T;
  public abstract match<T>(success: BiFunction<S, Success<S, F>, Promise<T>>, failure: BiFunction<F, Failure<S, F>, Promise<T>>): Promise<T>;
  public abstract match<T, E extends Error>(success: BiFunction<S, Success<S, F>, Superposition<T, E>>, failure: BiFunction<F, Failure<S, F>, Superposition<T, E>>): Superposition<T, E>;
  public abstract match<T, E extends Error>(success: BiFunction<S, Success<S, F>, Promise<Superposition<T, E>>>, failure: BiFunction<F, Failure<S, F>, Promise<Superposition<T, E>>>): Promise<Superposition<T, E>>;

  public isSuccess(): this is Success<S, F> {
    return false;
  }

  public isFailure(): this is Failure<S, F> {
    return false;
  }
}
