import { DataSourceError } from '../DataSourceError';

export class CacheError extends DataSourceError {
  public readonly name: 'CacheError' = 'CacheError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
