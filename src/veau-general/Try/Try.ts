import { Function } from '../Type/Function';
import { Failure } from './Failure';
import { Success } from './Success';

export abstract class Try<S, F extends Error> {

  protected constructor() {
  }

  public abstract get(): S;

  public abstract isSuccess(): this is Success<S, F>;

  public abstract isFailure(): this is Failure<S, F>;

  public abstract match<T>(success: Function<S, T>, failure: Function<F, T>): T;
}
