import { Function } from '../Type/Function';
import { Failure } from './Failure';
import { Success } from './Success';

export type A<S, F extends Error> = {
  success: S | void;
  failure: F | void;
};

export interface Try<S, F extends Error> {

  get(): S;

  isSuccess(): this is Success<S, F>;

  isFailure(): this is Failure<S, F>;

  complete<T, E extends Error>(success: Function<S, Try<T, E>>, failure: Function<F, Try<T, E>>): Try<T, E>;

  match<T>(success: Function<S, T>, failure: Function<F, T>): T;
}
