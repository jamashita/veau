import { RuntimeError } from '@jamashita/publikum-error';

export class LanguageError extends RuntimeError<'LanguageError'> {
  public readonly noun: 'LanguageError' = 'LanguageError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
