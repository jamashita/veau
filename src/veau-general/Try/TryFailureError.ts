import { RuntimeError } from '../RuntimeError';

export class TryFailureError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
