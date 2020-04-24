import { RuntimeError } from 'publikum';

export class AuthenticationFailureError extends RuntimeError {
  public readonly name: 'AuthenticationFailureError' = 'AuthenticationFailureError';

  public constructor(cause?: Error) {
    super('AUTHENTICATION FAILED', cause);
  }
}
