import { BiFunction } from '../Type/Function';
import { Failure } from './Failure';
import { Success } from './Success';

export abstract class Try<S, F extends Error> {
  public abstract readonly noun: string;

  protected constructor() {
  }

  public abstract get(): S;

  public abstract isSuccess(): this is Success<S, F>;

  public abstract isFailure(): this is Failure<S, F>;

  public abstract match<T>(success: BiFunction<S, Success<S, F>, T>, failure: BiFunction<F, Failure<S, F>, T>): T;
}
