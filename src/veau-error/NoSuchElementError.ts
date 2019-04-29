import { RuntimeError } from './RuntimeError';

export class NoSuchElementError extends RuntimeError {

  public constructor(message: string) {
    super(`NO SUCH KEY: ${message}`);
  }
}
