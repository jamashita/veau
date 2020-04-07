import { UnimplementedError } from '../../UnimplementedError';
import { IRedisHash } from '../interfaces/IRedisHash';

export class MockRedisHash implements IRedisHash {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async set(key: string, field: string, value: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async get(key: string, field: string): Promise<string | null> {
    return Promise.reject<string | null>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete(key: string, field: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async length(key: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async has(key: string, field: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }
}