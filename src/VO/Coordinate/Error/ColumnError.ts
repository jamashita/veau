import { RuntimeError } from '@jamashita/anden-error';

export class ColumnError extends RuntimeError<'ColumnError'> {
  public readonly noun: 'ColumnError' = 'ColumnError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
