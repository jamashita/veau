import { RuntimeError } from '../RuntimeError';

export class TryFailureError extends RuntimeError {

  public constructor() {
    super('PREDICATE NOT SATISFIED');
  }
}
