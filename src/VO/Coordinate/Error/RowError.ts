import { RuntimeError } from '@jamashita/publikum-error';

export class RowError extends RuntimeError {
  public readonly name: 'RowError' = 'RowError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
