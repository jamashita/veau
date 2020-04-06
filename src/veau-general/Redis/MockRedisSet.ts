import IORedis from 'ioredis';
import { UnimplementedError } from '../UnimplementedError';
import { RedisSet } from './RedisSet';

export class MockRedisSet extends RedisSet {

  public constructor(client: IORedis.Redis) {
    super(client);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async add(key: string, ...values: Array<string>): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async remove(key: string, ...values: Array<string>): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async has(key: string, value: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async length(key: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async dump(key: string): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async random(key: string): Promise<string | null> {
    return Promise.reject<string | null>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async pop(key: string): Promise<string | null> {
    return Promise.reject<string | null>(new UnimplementedError());
  }
}
