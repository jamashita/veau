import { RedisError } from '../RedisError';

export class MockRedisError extends RedisError {

  public constructor() {
    super(new Error());
  }
}
