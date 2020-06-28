import { RuntimeError } from '@jamashita/publikum-error';

export class LanguagesError extends RuntimeError<'LanguagesError'> {
  public readonly noun: 'LanguagesError' = 'LanguagesError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
