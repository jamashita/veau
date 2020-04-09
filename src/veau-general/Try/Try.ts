import { BiFunction, MonoFunction } from '../Type/Function';
import { Failure } from './Failure';
import { Success } from './Success';

export abstract class Try<S, F extends Error> {
  public abstract readonly noun: string;

  protected constructor() {
  }

  public abstract get(): S;

  public abstract isSuccess(): this is Success<S, F>;

  public abstract isFailure(): this is Failure<S, F>;

  public abstract match<T>(success: MonoFunction<S, T>, failure: MonoFunction<F, T>): T;

  public abstract complete<T = S, E extends Error = F>(success: BiFunction<S, Success<S, F>, T | Try<T, F | E>>): Try<S | T, F | E>;

  public abstract recover<T = S, E extends Error = F>(failure: BiFunction<F, Failure<S, F>, T | Try<T, F | E>>): Try<S | T, F | E>;
}
