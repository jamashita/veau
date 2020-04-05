import { RuntimeError } from '../veau-general/RuntimeError';

export class UnauthorizedError extends RuntimeError {
  public readonly name: 'UnauthorizedError' = 'UnauthorizedError';

  public constructor() {
    super('IDENTITY RETURNED UNAUTHORIZED');
  }
}
