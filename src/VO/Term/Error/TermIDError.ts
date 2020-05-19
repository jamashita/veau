import { RuntimeError } from 'publikum';

export class TermIDError extends RuntimeError {
  public readonly name: 'TermIDError' = 'TermIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
