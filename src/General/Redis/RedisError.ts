import { DataSourceError } from '../DataSourceError';

export class RedisError extends DataSourceError {
  public readonly name: 'RedisError' = 'RedisError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
