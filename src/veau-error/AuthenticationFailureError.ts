import { RuntimeError } from '../veau-general/RuntimeError';

export class AuthenticationFailureError extends RuntimeError {
  public readonly name: 'AuthenticationFailureError' = 'AuthenticationFailureError';

  public constructor() {
    super('AUTHENTICATION FAILED');
  }
}
