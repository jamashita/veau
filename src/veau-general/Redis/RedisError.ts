import { RuntimeError } from '../RuntimeError';

export class RedisError extends RuntimeError {
  public readonly name: 'RedisError' = 'RedisError';

  public constructor(err: Error) {
    super(err.message);
    this.stack = err.stack;
  }
}
