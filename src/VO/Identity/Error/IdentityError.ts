import { RuntimeError } from '@jamashita/anden-error';

export class IdentityError extends RuntimeError<'IdentityError'> {
  public readonly noun: 'IdentityError' = 'IdentityError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
