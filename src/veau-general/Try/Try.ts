import { Function } from '../Type/Function';
import { Failure } from './Failure';
import { Success } from './Success';

export interface Try<S, F extends Error> {

  get(): S;

  isSuccess(): this is Success<S, F>;

  isFailure(): this is Failure<S, F>;

  match<T>(success: Function<S, T>, failure: Function<F, T>): T;
}
