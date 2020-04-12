import { RuntimeError } from '../General/RuntimeError';

export class AccountError extends RuntimeError {
  public readonly name: 'AccountError' = 'AccountError';

  // TODO
  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
