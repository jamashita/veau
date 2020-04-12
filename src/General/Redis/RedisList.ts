import IORedis from 'ioredis';
import { IRedisList } from './Interface/IRedisList';
import { RedisError } from './RedisError';

export class RedisList implements IRedisList {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async push(key: string, value: string): Promise<number> {
    try {
      const result: number = await this.client.rpush(key, value);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON RPUSH', err);
      }

      throw err;
    }
  }

  public async pop(key: string): Promise<string> {
    try {
      const result: string = await this.client.rpop(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON RPOP', err);
      }

      throw err;
    }
  }

  public async shift(key: string): Promise<string> {
    try {
      const result: string = await this.client.lpop(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON LPOP', err);
      }

      throw err;
    }
  }

  public async length(key: string): Promise<number> {
    try {
      const result: number = await this.client.llen(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON LLEN', err);
      }

      throw err;
    }
  }

  public async remove(key: string, value: string): Promise<number> {
    try {
      const result: number = await this.client.lrem(key, 0, value);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON LREM', err);
      }

      throw err;
    }
  }

  public async select(key: string, offset: number, limit: number): Promise<Array<string>> {
    const start: number = offset;
    const stop: number = offset + limit;

    try {
      const result: Array<string> = await this.client.lrange(key, start, stop);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON LRANGE', err);
      }

      throw err;
    }
  }

  public async dump(key: string): Promise<Array<string>> {
    try {
      const result: Array<string> = await this.client.lrange(key, 0, -1);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError('FAIL ON LRANGE', err);
      }

      throw err;
    }
  }
}
