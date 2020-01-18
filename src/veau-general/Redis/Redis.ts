import IORedis from 'ioredis';
import { RedisHash } from './RedisHash';
import { RedisList } from './RedisList';
import { RedisSet } from './RedisSet';
import { RedisString } from './RedisString';

export class Redis {
  private hash: RedisHash;
  private set: RedisSet;
  private list: RedisList;
  private string: RedisString;
  private client: IORedis.Redis;

  public constructor(config: IORedis.RedisOptions) {
    const client: IORedis.Redis = new IORedis(config);

    this.hash = new RedisHash(client);
    this.set = new RedisSet(client);
    this.list = new RedisList(client);
    this.string = new RedisString(client);

    this.client = client;
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

  public async delete(key: string): Promise<boolean> {
    const result: number = await this.client.del(key);

    if (result === 0) {
      return false;
    }

    return true;
  }

  public async exists(key: string): Promise<boolean> {
    const result: number = await this.client.exists(key);

    if (result === 0) {
      return false;
    }

    return true;
  }

  public async expires(key: string, seconds: number): Promise<boolean> {
    const result: 0 | 1 = await this.client.expire(key, seconds);

    if (result === 0) {
      return false;
    }

    return true;
  }

  public subscribe(channel: string): unknown {
    return this.client.subscribe(channel);
  }

  public unsubscribe(channel: string): unknown {
    return this.client.unsubscribe(channel);
  }

  public publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message);
  }

  public onMessage(callback: (channel: string, message: string) => void): void {
    this.client.on('message', callback);
  }
}
