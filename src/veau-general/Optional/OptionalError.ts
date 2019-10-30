import { RuntimeError } from '../RuntimeError';

export class OptionalError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
