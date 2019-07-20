import { RuntimeError } from './RuntimeError';

export class UnauthorizedError extends RuntimeError {

  public constructor() {
    super('IDENTITY RETURNED UNAUTHORIZED');
  }
}
