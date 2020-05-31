import { RuntimeError } from '@jamashita/publikum-error';

export class LoadingCountError extends RuntimeError {
  public readonly name: 'LoadingCountError' = 'LoadingCountError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
