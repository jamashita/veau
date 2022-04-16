import { RuntimeError } from '@jamashita/anden-error';

export class HeaderSizeError extends RuntimeError<'HeaderSizeError'> {
  public readonly noun: 'HeaderSizeError' = 'HeaderSizeError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
