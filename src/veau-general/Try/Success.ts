import { MonoFunction } from '../Type/Function';
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
  public match<T>(success: MonoFunction<S, T>, failure: MonoFunction<F, T>): T {
    return success(this.value);
  }

  public complete<U>(mapper: MonoFunction<S, U | Try<U, F>>): Try<U, F> {
    const result: U | Try<U, F> = mapper(this.value);

    if (result instanceof Try) {
      return result;
    }

    return Success.of<U, F>(result);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public recover<U>(mapper: MonoFunction<F, U | Try<U, F>>): Try<U, F> {
    return this as never as Try<U, F>;
  }
}
