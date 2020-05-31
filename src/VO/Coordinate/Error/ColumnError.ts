import { RuntimeError } from '@jamashita/publikum-error';

export class ColumnError extends RuntimeError {
  public readonly name: 'ColumnError' = 'ColumnError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
