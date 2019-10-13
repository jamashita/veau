import { RuntimeError } from '../veau-general/RuntimeError';

export class AuthenticationFailureError extends RuntimeError {

  public constructor() {
    super('AUTHENTICATION FAILED');
  }
}
