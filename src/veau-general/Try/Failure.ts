import { BiFunction, MonoFunction } from '../Type/Function';
import { Success } from './Success';
import { Try } from './Try';

export class Failure<S, F extends Error> extends Try<S, F> {
  public readonly noun: 'Failure' = 'Failure';
  private readonly value: F;

  public static of<S, F extends Error>(value: F): Failure<S, F> {
    return new Failure<S, F>(value);
  }

  private constructor(value: F) {
    super();
    this.value = value;
  }

  public get(): S {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.value as Error;
  }

  public getError(): F {
    return this.value;
  }

  public isSuccess(): this is Success<S, F> {
    return false;
  }

  public isFailure(): this is Failure<S, F> {
    return true;
  }

  public match<T>(success: MonoFunction<S, T>, failure: MonoFunction<F, T>): T {
    return failure(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public complete<T = S, E extends Error = F>(success: BiFunction<S, Success<S, F>, T | Try<T, F | E>>): Try<S | T, F | E> {
    return this;
  }

  public recover<T = S, E extends Error = F>(failure: BiFunction<F, Failure<S, F>, T | Try<T, F | E>>): Try<S | T, F | E> {
    const recovery: T | Try<T, F | E> = failure(this.value, this);

    if (recovery instanceof Try) {
      return recovery;
    }

    return Success.of<T, F>(recovery);
  }


  public transpose<T>(): Failure<T, F> {
    return this as never as Failure<T, F>;
  }
}
