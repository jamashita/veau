import { RuntimeError } from '../veau-general/RuntimeError';

export class RowError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
