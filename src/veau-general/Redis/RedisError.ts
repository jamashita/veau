import { SourceError } from '../SourceError';

export class RedisError extends SourceError {
  public readonly name: 'RedisError' = 'RedisError';

  public constructor(err: Error) {
    super(err.message);
    this.stack = err.stack;
  }
}
