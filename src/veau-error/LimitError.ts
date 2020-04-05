import { RuntimeError } from '../veau-general/RuntimeError';

export class LimitError extends RuntimeError {
  public readonly name: 'LimitError' = 'LimitError';

  public constructor(message: string) {
    super(message);
  }
}
