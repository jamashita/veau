import { RuntimeError } from '@jamashita/anden-error';

export class NoSuchElementError extends RuntimeError<'NoSuchElementError'> {
  public readonly noun: 'NoSuchElementError' = 'NoSuchElementError';

  public constructor(message: number | string, cause?: Error) {
    super(`NO SUCH KEY: ${message}`, cause);
  }
}
