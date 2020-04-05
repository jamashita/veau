import { RuntimeError } from '../veau-general/RuntimeError';

export class ColumnError extends RuntimeError {
  public readonly name: 'ColumnError' = 'ColumnError';

  public constructor(message: string) {
    super(message);
  }
}
