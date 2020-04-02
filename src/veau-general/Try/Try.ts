import { Function } from '../Type/Function';
import { Failure } from './Failure';
import { Success } from './Success';

export interface Try<S, F extends Error> {

  get(): S;

  isSuccess(): this is Success<S, F>;

  isFailure(): this is Failure<S, F>;

  complete<U>(success: Function<S, U>, failure: Function<F, U>): U;

  map<U>(mapper: Function<S, U>): Try<U, F>;
}
