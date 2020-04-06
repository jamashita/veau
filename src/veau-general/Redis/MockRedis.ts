import IORedis from 'ioredis';
import { UnimplementedError } from '../UnimplementedError';
import { MockRedisHash } from './MockRedisHash';
import { MockRedisList } from './MockRedisList';
import { MockRedisSet } from './MockRedisSet';
import { MockRedisString } from './MockRedisString';
import { Redis } from './Redis';
import { RedisHash } from './RedisHash';
import { RedisList } from './RedisList';
import { RedisSet } from './RedisSet';
import { RedisString } from './RedisString';

export class MockRedis extends Redis {

  public static of(): MockRedis {
    const client: IORedis.Redis = new IORedis({});
    const hash: RedisHash = new MockRedisHash(client);
    const set: RedisSet = new MockRedisSet(client);
    const list: RedisList = new MockRedisList(client);
    const string: RedisString = new MockRedisString(client);

    return new MockRedis(client, hash, set, list, string);
  }

  protected constructor(client: IORedis.Redis,
    hash: RedisHash,
    set: RedisSet,
    list: RedisList,
    string: RedisString) {
    super(client, hash, set, list, string);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete(...keys: Array<string>): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async exists(...keys: Array<string>): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async expires(key: string, seconds: number): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async subscribe(...channels: Array<string>): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async unsubscribe(...channels: Array<string>): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async publish(channel: string, message: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public on(callback: (channel: string, message: string) => void): void {
    // NOOP
  }
}
