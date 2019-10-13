import { RuntimeError } from '../veau-general/RuntimeError';

export class UnauthorizedError extends RuntimeError {

  public constructor() {
    super('IDENTITY RETURNED UNAUTHORIZED');
  }
}
