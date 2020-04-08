import { Nullable } from '../../Type/Value';
import { UnimplementedError } from '../../UnimplementedError';
import { IRedisString } from '../interfaces/IRedisString';

export class MockRedisString implements IRedisString {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public set(key: string, value: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get(key: string): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }
}
