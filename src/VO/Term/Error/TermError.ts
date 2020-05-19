import { RuntimeError } from 'publikum';

export class TermError extends RuntimeError {
  public readonly name: 'TermError' = 'TermError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
