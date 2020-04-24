import { RuntimeError } from 'publikum';

export class LimitError extends RuntimeError {
  public readonly name: 'LimitError' = 'LimitError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
