import { RuntimeError } from '../RuntimeError';

export class OptionalError extends RuntimeError {
  public readonly name: 'OptionalError' = 'OptionalError';

  public constructor(message: string) {
    super(message);
  }
}
