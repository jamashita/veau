import { Nullable } from '../../Type/Value';
import { UnimplementedError } from '../../UnimplementedError';
import { IRedisHash } from '../interfaces/IRedisHash';

export class MockRedisHash implements IRedisHash {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public set(key: string, field: string, value: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get(key: string, field: string): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delete(key: string, field: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public length(key: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public has(key: string, field: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }
}
