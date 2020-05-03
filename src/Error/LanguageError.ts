import { RuntimeError } from 'publikum';

export class LanguageError extends RuntimeError {
  public readonly name: 'LanguageError' = 'LanguageError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
