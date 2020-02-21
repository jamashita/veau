import { RuntimeError } from '../veau-general/RuntimeError';

export class PageError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
