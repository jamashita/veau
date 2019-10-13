import { RuntimeError } from '../veau-general/RuntimeError';

export class NoSuchElementError extends RuntimeError {

  public constructor(message: string) {
    super(`NO SUCH KEY: ${message}`);
  }
}
