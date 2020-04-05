import { RuntimeError } from '../veau-general/RuntimeError';

export class NoSuchElementError extends RuntimeError {
  public readonly name: 'NoSuchElementError' = 'NoSuchElementError';

  public constructor(message: string) {
    super(`NO SUCH KEY: ${message}`);
  }
}
