import { RuntimeError } from '@jamashita/anden-error';

export class PageError extends RuntimeError<'PageError'> {
  public readonly noun: 'PageError' = 'PageError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
