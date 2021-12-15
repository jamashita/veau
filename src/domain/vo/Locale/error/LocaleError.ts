import { RuntimeError } from '@jamashita/anden-error';

export class LocaleError extends RuntimeError {
  public readonly noun: 'LocaleError' = 'LocaleError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
