import { UnimplementedError } from '../../UnimplementedError';
import { IRedisString } from '../interfaces/IRedisString';

export class MockRedisString implements IRedisString {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async set(key: string, value: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async get(key: string): Promise<string | null> {
    return Promise.reject<string | null>(new UnimplementedError());
  }
}
