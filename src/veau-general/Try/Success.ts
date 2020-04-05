import { Function } from '../Type/Function';
import { Failure } from './Failure';
import { Try } from './Try';

export class Success<S, F extends Error> extends Try<S, F> {
  public readonly noun: 'Success' = 'Success';
  private readonly value: S;

  public static of<S, F extends Error>(value: S): Success<S, F> {
    return new Success<S, F>(value);
  }

  private constructor(value: S) {
    super();
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
  public match<T>(success: Function<S, T>, failure: Function<F, T>): T {
    return success(this.value);
  }
}
