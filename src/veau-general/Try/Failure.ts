import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { Success } from './Success';
import { Try } from './Try';
import { TryFailureError } from './TryFailureError';

export class Failure<S, F extends Error> implements Try<S, F> {
  private value: F;

  public static of<S, F extends Error>(value: F): Failure<S, F> {
    return new Failure(value);
  }

  private constructor(value: F) {
    this.value = value;
  }

  public get(): S {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.value as Error;
  }

  public isSuccess(): this is Success<S, F> {
    return false;
  }

  public isFailure(): this is Failure<S, F> {
    return true;
  }

  public complete<U>(success: Function<S, U>, failure: Function<F, U>): U {
    return failure(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<S>): Try<S, F | TryFailureError> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U>(mapper: Function<S, U>): Try<U, F> {
    return Failure.of<U, F>(this.value);
  }
}
