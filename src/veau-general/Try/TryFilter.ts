import { Failure } from './Failure';
import { Success } from './Success';
import { Try } from './Try';

export class TryFilter {

  public static isSuccess(trial: Try<unknown, Error>): trial is Success<unknown, Error> {
    return trial.isSuccess();
  }

  public static isFailure(trial: Try<unknown, Error>): trial is Failure<unknown, Error> {
    return trial.isFailure();
  }

  private constructor() {
  }
}
