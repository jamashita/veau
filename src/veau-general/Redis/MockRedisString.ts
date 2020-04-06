import IORedis from 'ioredis';
import { UnimplementedError } from '../UnimplementedError';
import { RedisString } from './RedisString';

export class MockRedisString extends RedisString {

  public constructor(client: IORedis.Redis) {
    super(client);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async set(key: string, value: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async get(key: string): Promise<string | null> {
    return Promise.reject<string | null>(new UnimplementedError());
  }
}
