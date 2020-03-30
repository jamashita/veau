import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { Failure } from './Failure';
import { Try } from './Try';
import { TryFailureError } from './TryFailureError';

export class Success<S, F extends Error> implements Try<S, F> {
  private value: S;

  public static of<S, F extends Error>(value: S): Success<S, F> {
    return new Success<S, F>(value);
  }

  private constructor(value: S) {
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
  public complete<U>(success: Function<S, U>, failure: Function<F, U>): U {
    return success(this.value);
  }

  public filter(predicate: Predicate<S>): Try<S, F | TryFailureError> {
    if (predicate(this.value)) {
      return this;
    }

    return Failure.of<S, TryFailureError>(new TryFailureError('PREDICATE NOT SATISFIED'));
  }

  public map<U>(mapper: Function<S, U>): Try<U, F> {
    const result: U = mapper(this.value);

    return Success.of<U, F>(result);
  }
}
