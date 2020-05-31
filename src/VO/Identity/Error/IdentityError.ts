import { RuntimeError } from '@jamashita/publikum-error';

export class IdentityError extends RuntimeError {
  public readonly name: 'IdentityError' = 'IdentityError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
