import { RuntimeError } from '@jamashita/publikum-error';

export class LanguagesError extends RuntimeError {
  public readonly name: 'LanguagesError' = 'LanguagesError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
