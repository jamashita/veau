import { RuntimeError } from '../General/RuntimeError';

export class AuthenticationFailureError extends RuntimeError {
  public readonly name: 'AuthenticationFailureError' = 'AuthenticationFailureError';

  public constructor(cause?: Error) {
    super('AUTHENTICATION FAILED', cause);
  }
}
