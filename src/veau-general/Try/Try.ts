import { MonoFunction } from '../Type/Function';
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

  public abstract complete<U>(mapper: MonoFunction<S, U | Try<U, F>>): Try<U, F>;

  public abstract recover<U>(mapper: MonoFunction<F, U | Try<U, F>>): Try<U, F>;
}
