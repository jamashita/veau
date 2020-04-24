import { RuntimeError } from 'publikum';

export class AccountError extends RuntimeError {
  public readonly name: 'AccountError' = 'AccountError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
