import IORedis from 'ioredis';
import { BiFunction } from '../../Type/Function';
import { IRedisHash } from './IRedisHash';
import { IRedisList } from './IRedisList';
import { IRedisSet } from './IRedisSet';
import { IRedisString } from './IRedisString';

export interface IRedis {

  getClient(): IORedis.Redis;

  getHash(): IRedisHash;

  getSet(): IRedisSet;

  getList(): IRedisList;

  getString(): IRedisString;

  delete(...keys: Array<string>): Promise<boolean>;

  exists(...keys: Array<string>): Promise<boolean>;

  expires(key: string, seconds: number): Promise<boolean>;

  subscribe(...channels: Array<string>): Promise<number>;

  unsubscribe(...channels: Array<string>): Promise<number>;

  publish(channel: string, message: string): Promise<number>;

  on(callback: BiFunction<string, string, void>): void;
}
