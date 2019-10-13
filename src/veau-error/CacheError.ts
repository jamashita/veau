import { RuntimeError } from '../veau-general/RuntimeError';

export class CacheError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
