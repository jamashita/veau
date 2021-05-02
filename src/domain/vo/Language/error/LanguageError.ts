import { RuntimeError } from '@jamashita/anden-error';

export class LanguageError extends RuntimeError<'LanguageError'> {
  public readonly noun: 'LanguageError' = 'LanguageError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
