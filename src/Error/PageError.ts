import { RuntimeError } from '../General/RuntimeError';

export class PageError extends RuntimeError {
  public readonly name: 'PageError' = 'PageError';

  public constructor(message: string) {
    super(message);
  }
}
