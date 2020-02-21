import { RuntimeError } from '../veau-general/RuntimeError';

export class ColumnError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
