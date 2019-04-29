import { RuntimeError } from './RuntimeError';

export class CacheError extends RuntimeError {

  public constructor(message: string) {
    super(message);
  }
}
