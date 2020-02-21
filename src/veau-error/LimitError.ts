import { RuntimeError } from '../veau-general/RuntimeError';

export class LimitError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
