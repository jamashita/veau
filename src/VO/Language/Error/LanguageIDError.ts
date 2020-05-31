import { RuntimeError } from '@jamashita/publikum-error';

export class LanguageIDError extends RuntimeError {
  public readonly name: 'LanguageIDError' = 'LanguageIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
