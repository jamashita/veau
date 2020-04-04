import { RuntimeError } from '../veau-general/RuntimeError';

export class AccountError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
