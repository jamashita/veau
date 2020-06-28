import { RuntimeError } from '@jamashita/publikum-error';

export class TermsError extends RuntimeError<'TermsError'> {
  public readonly noun: 'TermsError' = 'TermsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
