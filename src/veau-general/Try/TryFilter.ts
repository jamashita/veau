import { Failure } from './Failure';
import { Success } from './Success';
import { Try } from './Try';

export class TryFilter {

  public static isSuccess<S, F extends Error>(trial: Try<S, F>): trial is Success<S, F> {
    return trial.isSuccess();
  }

  public static isFailure<S, F extends Error>(trial: Try<S, F>): trial is Failure<S, F> {
    return trial.isFailure();
  }

  private constructor() {
  }
}
