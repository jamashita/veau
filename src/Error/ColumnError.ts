import { RuntimeError } from '../General/RuntimeError';

export class ColumnError extends RuntimeError {
  public readonly name: 'ColumnError' = 'ColumnError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
