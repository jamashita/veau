import IORedis from 'ioredis';
import { UnimplementedError } from '../../UnimplementedError';
import { IRedis } from '../interfaces/IRedis';
import { IRedisHash } from '../interfaces/IRedisHash';
import { IRedisList } from '../interfaces/IRedisList';
import { IRedisSet } from '../interfaces/IRedisSet';
import { IRedisString } from '../interfaces/IRedisString';
import { MockRedisHash } from './MockRedisHash';
import { MockRedisList } from './MockRedisList';
import { MockRedisSet } from './MockRedisSet';
import { MockRedisString } from './MockRedisString';

type MockRedisSetting = Readonly<{
  hash: IRedisHash;
  set: IRedisSet;
  list: IRedisList;
  string: IRedisString;
}>;

export class MockRedis implements IRedis {
  private readonly client: IORedis.Redis;
  private readonly hash: IRedisHash;
  private readonly set: IRedisSet;
  private readonly list: IRedisList;
  private readonly string: IRedisString;

  public static of(setting: Partial<MockRedisSetting>): MockRedis {
    let hash: IRedisHash;
    if (setting.hash === undefined) {
      hash = new MockRedisHash();
    }
    else {
      hash = setting.hash;
    }

    let set: IRedisSet;
    if (setting.set === undefined) {
      set = new MockRedisSet();
    }
    else {
      set = setting.set;
    }

    let list: IRedisList;
    if (setting.list === undefined) {
      list = new MockRedisList();
    }
    else {
      list = setting.list;
    }

    let string: IRedisString;
    if (setting.string === undefined) {
      string = new MockRedisString();
    }
    else {
      string = setting.string;
    }

    return new MockRedis(hash, set, list, string);
  }

  private constructor(hash: IRedisHash,
    set: IRedisSet,
    list: IRedisList,
    string: IRedisString) {
    this.client = new IORedis({});
    this.hash = hash;
    this.set = set;
    this.list = list;
    this.string = string;
  }

  public getClient(): IORedis.Redis {
    return this.client;
  }

  public getHash(): IRedisHash {
    return this.hash;
  }

  public getSet(): IRedisSet {
    return this.set;
  }

  public getList(): IRedisList {
    return this.list;
  }

  public getString(): IRedisString {
    return this.string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delete(...keys: Array<string>): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public exists(...keys: Array<string>): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public expires(key: string, seconds: number): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public subscribe(...channels: Array<string>): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public unsubscribe(...channels: Array<string>): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public publish(channel: string, message: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public on(callback: (channel: string, message: string) => void): void {
    // NOOP
  }
}
