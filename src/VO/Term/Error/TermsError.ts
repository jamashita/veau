import { RuntimeError } from 'publikum';

export class TermsError extends RuntimeError {
  public readonly name: 'TermsError' = 'TermsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
