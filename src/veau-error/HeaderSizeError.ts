import { RuntimeError } from '../veau-general/RuntimeError';

export class HeaderSizeError extends RuntimeError {
  public readonly name: 'HeaderSizeError' = 'HeaderSizeError';

  public constructor(message: string) {
    super(message);
  }
}
