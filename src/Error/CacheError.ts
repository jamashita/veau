import { RuntimeError } from '../General/RuntimeError';

export class CacheError extends RuntimeError {
  public readonly name: 'CacheError' = 'CacheError';

  public constructor(message: string) {
    super(message);
  }
}