import { RuntimeError } from '../veau-general/RuntimeError';

export class PageError extends RuntimeError {
  public readonly name: 'PageError' = 'PageError';

  public constructor(message: string) {
    super(message);
  }
}
