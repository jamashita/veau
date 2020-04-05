import { RuntimeError } from '../veau-general/RuntimeError';

export class RowError extends RuntimeError {
  public readonly name: 'RowError' = 'RowError';

  public constructor(message: string) {
    super(message);
  }
}
