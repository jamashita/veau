import { RuntimeError } from '../veau-general/RuntimeError';

export class HeaderSizeError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
