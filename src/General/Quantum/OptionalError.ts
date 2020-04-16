import { RuntimeError } from '../RuntimeError';

export class OptionalError extends RuntimeError {
  public readonly name: 'OptionalError' = 'OptionalError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
