import { RuntimeError } from '@jamashita/publikum-error';

export class LocaleError extends RuntimeError {
  public readonly name: 'LocaleError' = 'LocaleError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
