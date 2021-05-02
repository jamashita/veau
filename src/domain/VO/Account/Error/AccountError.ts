import { RuntimeError } from '@jamashita/anden-error';

export class AccountError extends RuntimeError<'AccountError'> {
  public readonly noun: 'AccountError' = 'AccountError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
