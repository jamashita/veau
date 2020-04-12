import { RuntimeError } from '../General/RuntimeError';

export class UnauthorizedError extends RuntimeError {
  public readonly name: 'UnauthorizedError' = 'UnauthorizedError';

  public constructor(cause?: Error) {
    super('IDENTITY RETURNED UNAUTHORIZED', cause);
  }
}
