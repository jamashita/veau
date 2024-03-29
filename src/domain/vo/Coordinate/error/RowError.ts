import { RuntimeError } from '@jamashita/anden-error';

export class RowError extends RuntimeError<'RowError'> {
  public readonly noun: 'RowError' = 'RowError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
