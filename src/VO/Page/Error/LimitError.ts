import { RuntimeError } from '@jamashita/publikum-error';

export class LimitError extends RuntimeError<'LimitError'> {
  public readonly noun: 'LimitError' = 'LimitError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
