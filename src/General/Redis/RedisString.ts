import IORedis from 'ioredis';
import { Nullable } from '../Type/Value';
import { IRedisString } from './Interface/IRedisString';
import { RedisError } from './RedisError';

export class RedisString implements IRedisString {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async set(key: string, value: string): Promise<boolean> {
    try {
      const result: string = await this.client.set(key, value);

      if (result === 'OK') {
        return true;
      }

      return false;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON SET', err);
      }

      throw err;
    }
  }

  public async get(key: string): Promise<Nullable<string>> {
    try {
      const result: Nullable<string> = await this.client.get(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON GET', err);
      }

      throw err;
    }
  }
}
