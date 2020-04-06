import IORedis from 'ioredis';
import { IRedisString } from './interfaces/IRedisString';
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
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      const result: string | null = await this.client.get(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }
}
