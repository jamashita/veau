import IORedis from 'ioredis';
import { Nullable } from '../Type/Value';
import { IRedisHash } from './interfaces/IRedisHash';
import { RedisError } from './RedisError';

export class RedisHash implements IRedisHash {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async set(key: string, field: string, value: string): Promise<boolean> {
    try {
      const result: 0 | 1 = await this.client.hset(key, field, value);

      if (result === 0) {
        return false;
      }

      return true;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async get(key: string, field: string): Promise<Nullable<string>> {
    try {
      const result: Nullable<string> = await this.client.hget(key, field);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async delete(key: string, field: string): Promise<number> {
    try {
      const result: number = await this.client.hdel(key, field);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async length(key: string): Promise<number> {
    try {
      const result: number = await this.client.hlen(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async has(key: string, field: string): Promise<boolean> {
    try {
      const result: 0 | 1 = await this.client.hexists(key, field);

      if (result === 0) {
        return false;
      }

      return true;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }
}
