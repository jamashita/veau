import { RuntimeError } from '@jamashita/publikum-error';

export class AccountError extends RuntimeError {
  public readonly name: 'AccountError' = 'AccountError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
