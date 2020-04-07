import { MonoFunction } from '../Type/Function';
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

  public isSuccess(): this is Success<S, F> {
    return false;
  }

  public isFailure(): this is Failure<S, F> {
    return true;
  }

  public match<T>(success: MonoFunction<S, T>, failure: MonoFunction<F, T>): T {
    return failure(this.value);
  }

  public getMessage(): string {
    return this.value.message;
  }
}
