import * as IORedis from 'ioredis';
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

    client.on('error', (err: any) => {
      console.log('REDIS ERROR');
      console.log(err);
    });

    this.hash = new RedisHash(client);
    this.set = new RedisSet(client);
    this.list = new RedisList(client);
    this.string = new RedisString(client);

    this.client = client;
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

  public delete(key: string): Promise<boolean> {
    return this.client.del(key).then((result: number) => {
      if (result === 0) {
        return false;
      }

      return true;
    });
  }

  public exists(key: string): Promise<boolean> {
    return this.client.exists(key).then((result: number) => {
      if (result === 0) {
        return false;
      }

      return true;
    });
  }

  public expires(key: string, seconds: number): Promise<boolean> {
    return this.client.expire(key, seconds).then((result: 0 | 1) => {
      if (result === 0) {
        return false;
      }

      return true;
    });
  }
}
