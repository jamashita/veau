import IORedis from 'ioredis';
import { RedisError } from './RedisError';
import { RedisHash } from './RedisHash';
import { RedisList } from './RedisList';
import { RedisSet } from './RedisSet';
import { RedisString } from './RedisString';

export class Redis {
  private readonly hash: RedisHash;
  private readonly set: RedisSet;
  private readonly list: RedisList;
  private readonly string: RedisString;
  private readonly client: IORedis.Redis;

  public static of(config: IORedis.RedisOptions): Redis {
    const client: IORedis.Redis = new IORedis(config);
    const hash: RedisHash = new RedisHash(client);
    const set: RedisSet = new RedisSet(client);
    const list: RedisList = new RedisList(client);
    const string: RedisString = new RedisString(client);

    return new Redis(client, hash, set, list, string);
  }

  protected constructor(client: IORedis.Redis,
    hash: RedisHash,
    set: RedisSet,
    list: RedisList,
    string: RedisString) {
    this.client = client;
    this.hash = hash;
    this.set = set;
    this.list = list;
    this.string = string;
  }

  public getClient(): IORedis.Redis {
    return this.client;
  }

  public getHash(): RedisHash {
    return this.hash;
  }

  public getSet(): RedisSet {
    return this.set;
  }

  public getList(): RedisList {
    return this.list;
  }

  public getString(): RedisString {
    return this.string;
  }

  public async delete(...keys: Array<string>): Promise<boolean> {
    try {
      const result: number = await this.client.del(...keys);

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

  public async exists(...keys: Array<string>): Promise<boolean> {
    try {
      const result: number = await this.client.exists(...keys);

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

  public async expires(key: string, seconds: number): Promise<boolean> {
    try {
      const result: 0 | 1 = await this.client.expire(key, seconds);

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

  public async subscribe(...channels: Array<string>): Promise<number> {
    try {
      const result: number = await this.client.subscribe(...channels);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async unsubscribe(...channels: Array<string>): Promise<number> {
    try {
      const result: number = await this.client.unsubscribe(...channels);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public async publish(channel: string, message: string): Promise<number> {
    try {
      const result: number = await this.client.publish(channel, message);

      return result;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }

  public on(callback: (channel: string, message: string) => void): void {
    try {
      this.client.on('message', callback);
    }
    catch (err) {
      if (err instanceof Error) {
        throw new RedisError(err);
      }

      throw err;
    }
  }
}
