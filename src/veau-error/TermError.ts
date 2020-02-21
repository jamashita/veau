import { RuntimeError } from '../veau-general/RuntimeError';

export class TermError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
