import { RuntimeError } from '../veau-general/RuntimeError';

export class AccountError extends RuntimeError {
  public readonly name: 'AccountError' = 'AccountError';

  // TODO
  public constructor(message: string) {
    super(message);

  }
}
