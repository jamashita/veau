import { RuntimeError } from '@jamashita/publikum-error';

export class TermError extends RuntimeError {
  public readonly name: 'TermError' = 'TermError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
