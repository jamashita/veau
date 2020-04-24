import { RuntimeError } from 'publikum';

export class RowError extends RuntimeError {
  public readonly name: 'RowError' = 'RowError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
