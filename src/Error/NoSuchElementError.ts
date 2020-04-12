import { RuntimeError } from '../General/RuntimeError';

export class NoSuchElementError extends RuntimeError {
  public readonly name: 'NoSuchElementError' = 'NoSuchElementError';

  public constructor(message: number | string, cause?: Error) {
    super(`NO SUCH KEY: ${message}`, cause);
  }
}
