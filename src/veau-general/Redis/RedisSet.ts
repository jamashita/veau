import IORedis from 'ioredis';
import { RedisError } from './RedisError';

export class RedisSet {
  private readonly client: IORedis.Redis;

  public constructor(client: IORedis.Redis) {
    this.client = client;
  }

  public async add(key: string, ...values: Array<string>): Promise<number> {
    try {
      const result: number = await this.client.sadd(key, ...values);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async remove(key: string, ...values: Array<string>): Promise<number> {
    try {
      const result: number = await this.client.srem(key, ...values);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async has(key: string, value: string): Promise<boolean> {
    try {
      const result: 0 | 1 = await this.client.sismember(key, value);

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

  public async length(key: string): Promise<number> {
    try {
      const result: number = await this.client.scard(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async dump(key: string): Promise<Array<string>> {
    try {
      const result: Array<string> = await this.client.smembers(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async random(key: string): Promise<string | null> {
    try {
      const result: string | null = await this.client.srandmember(key);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async pop(key: string): Promise<string | null> {
    try {
      const result: string | null = await this.client.spop(key);

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
