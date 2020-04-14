import { RuntimeError } from '../RuntimeError';

export class MockError extends RuntimeError {
  public readonly name: 'MockError' = 'MockError';

  public constructor(cause?: Error) {
    super('failed', cause);
  }
}
