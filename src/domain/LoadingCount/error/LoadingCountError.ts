import { RuntimeError } from '@jamashita/anden-error';

export class LoadingCountError extends RuntimeError<'LoadingCountError'> {
  public readonly noun: 'LoadingCountError' = 'LoadingCountError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
