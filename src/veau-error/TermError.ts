import { RuntimeError } from '../veau-general/RuntimeError';

export class TermError extends RuntimeError {
  public readonly name: 'TermError' = 'TermError';

  public constructor(message: string) {
    super(message);
  }
}
