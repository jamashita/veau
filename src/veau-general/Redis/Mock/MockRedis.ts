import IORedis from 'ioredis';
import { BiFunction } from '../../Type/Function';
import { UnimplementedError } from '../../UnimplementedError';
import { IRedis } from '../Interface/IRedis';
import { IRedisHash } from '../Interface/IRedisHash';
import { IRedisList } from '../Interface/IRedisList';
import { IRedisSet } from '../Interface/IRedisSet';
import { IRedisString } from '../Interface/IRedisString';
import { MockRedisHash } from './MockRedisHash';
import { MockRedisList } from './MockRedisList';
import { MockRedisSet } from './MockRedisSet';
import { MockRedisString } from './MockRedisString';

type MockRedisSetting = Partial<Readonly<{
  hash: IRedisHash;
  set: IRedisSet;
  list: IRedisList;
  string: IRedisString;
}>>;

export class MockRedis implements IRedis {
  private readonly client: IORedis.Redis;
  private readonly hash: IRedisHash;
  private readonly set: IRedisSet;
  private readonly list: IRedisList;
  private readonly string: IRedisString;

  public constructor({
    hash = new MockRedisHash(),
    set = new MockRedisSet(),
    list = new MockRedisList(),
    string = new MockRedisString()
  }: MockRedisSetting = {}) {
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
  public on(callback: BiFunction<string, string, void>): void {
    // NOOP
  }
}
