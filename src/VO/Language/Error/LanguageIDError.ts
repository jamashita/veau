import { RuntimeError } from '@jamashita/publikum-error';

export class LanguageIDError extends RuntimeError<'LanguageIDError'> {
  public readonly noun: 'LanguageIDError' = 'LanguageIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
