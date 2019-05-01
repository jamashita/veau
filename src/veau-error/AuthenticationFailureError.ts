import { RuntimeError } from './RuntimeError';

export class AuthenticationFailureError extends RuntimeError {

  public constructor() {
    super('AUTHENTICATION FAILED');
  }
}
