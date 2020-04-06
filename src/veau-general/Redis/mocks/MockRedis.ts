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

type MockRedisSetting = Readonly<{
  hash: RedisHash;
  set: RedisSet;
  list: RedisList;
  string: RedisString;
}>;

export class MockRedis extends Redis {

  public static ofSetting(setting?: Partial<MockRedisSetting>): MockRedis {
    const client: IORedis.Redis = new IORedis({});

    if (setting === undefined) {
      const hash: RedisHash = new MockRedisHash();
      const set: RedisSet = new MockRedisSet();
      const list: RedisList = new MockRedisList();
      const string: RedisString = new MockRedisString();

      return new MockRedis(client, hash, set, list, string);
    }

    let hash: RedisHash;
    if (setting.hash === undefined) {
      hash = new MockRedisHash();
    }
    else {
      hash = setting.hash;
    }

    let set: RedisSet;
    if (setting.set === undefined) {
      set = new MockRedisSet();
    }
    else {
      set = setting.set;
    }

    let list: RedisList;
    if (setting.list === undefined) {
      list = new MockRedisList();
    }
    else {
      list = setting.list;
    }

    let string: RedisString;
    if (setting.string === undefined) {
      string = new MockRedisString();
    }
    else {
      string = setting.string;
    }

    return new MockRedis(client, hash, set, list, string);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static of(config: IORedis.RedisOptions): MockRedis {
    const client: IORedis.Redis = new IORedis({});
    const hash: RedisHash = new MockRedisHash();
    const set: RedisSet = new MockRedisSet();
    const list: RedisList = new MockRedisList();
    const string: RedisString = new MockRedisString();

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
