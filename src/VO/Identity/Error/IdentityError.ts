import { RuntimeError } from 'publikum';

export class IdentityError extends RuntimeError {
  public readonly name: 'IdentityError' = 'IdentityError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
