import { RuntimeError } from 'publikum';

export class AuthenticationDeadError extends RuntimeError {
  public readonly name: 'AuthenticationDeadError' = 'AuthenticationDeadError';

  public constructor(cause?: Error) {
    super('AUTHENTICATION FAILED', cause);
  }
}
