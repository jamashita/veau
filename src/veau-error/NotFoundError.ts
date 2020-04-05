import { RuntimeError } from '../veau-general/RuntimeError';

export class NotFoundError extends RuntimeError {
  public readonly name: 'NotFoundError' = 'NotFoundError';

  public constructor(message: string) {
    super(message);
  }
}
