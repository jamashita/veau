import { DataSourceError } from '../DataSourceError';

export class RedisError extends DataSourceError {
  public readonly name: 'RedisError' = 'RedisError';

  public constructor(err: Error) {
    super(err.message);
    this.stack = err.stack;
  }
}
