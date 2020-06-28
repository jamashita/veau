import { RuntimeError } from '@jamashita/publikum-error';

export class TermError extends RuntimeError<'TermError'> {
  public readonly noun: 'TermError' = 'TermError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
