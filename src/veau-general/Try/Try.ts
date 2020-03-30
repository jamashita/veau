import { Function } from '../Type/Function';
import { Predicate } from '../Type/Predicate';
import { Failure } from './Failure';
import { Success } from './Success';
import { TryFailureError } from './TryFailureError';

export interface Try<S, F extends Error> {

  get(): S;

  isSuccess(): this is Success<S, F>;

  isFailure(): this is Failure<S, F>;

  complete<U>(success: Function<S, U>, failure: Function<F, U>): U;

  filter(predicate: Predicate<S>): Try<S, F | TryFailureError>;

  map<U>(mapper: Function<S, U>): Try<U, F>;
}
