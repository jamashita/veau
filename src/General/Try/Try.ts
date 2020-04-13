import { BiFunction } from '../Type/Function';
import { Failure } from './Failure';
import { Success } from './Success';

export abstract class Try<S, F extends Error> {
  public abstract readonly noun: 'Success' | 'Failure';

  protected constructor() {
  }

  public abstract get(): S;

  public isSuccess(): this is Success<S, F> {
    return false;
  }

  public isFailure(): this is Failure<S, F> {
    return false;
  }

  public abstract match<T>(success: BiFunction<S, Success<S, F>, T>, failure: BiFunction<F, Failure<S, F>, T>): T;
}
