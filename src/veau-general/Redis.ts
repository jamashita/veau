import * as redis from 'redis';
import { RedisHash } from './RedisHash';
import { RedisList } from './RedisList';
import { RedisSet } from './RedisSet';
import { RedisString } from './RedisString';

export class Redis {
  private hash: RedisHash;
  private set: RedisSet;
  private list: RedisList;
  private string: RedisString;
  private client: redis.RedisClient;

  public constructor(config: redis.ClientOpts) {
    const client: redis.RedisClient = redis.createClient(config);

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
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.del(key, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }

        if (response > 0) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }

  public exists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.exists(key, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }
        if (response === 1) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }

  public expires(key: string, seconds: number): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: any) => void): void => {
      this.client.expire(key, seconds, (err: Error | null, response: number): void => {
        if (err) {
          reject(err);
          return;
        }

        if (response === 1) {
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  }
}
