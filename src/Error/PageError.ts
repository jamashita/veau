import { RuntimeError } from 'publikum';

export class PageError extends RuntimeError {
  public readonly name: 'PageError' = 'PageError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
