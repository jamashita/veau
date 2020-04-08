import { Nullable } from '../../Type/Value';
import { UnimplementedError } from '../../UnimplementedError';
import { IRedisSet } from '../interfaces/IRedisSet';

export class MockRedisSet implements IRedisSet {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(key: string, ...values: Array<string>): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public remove(key: string, ...values: Array<string>): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public has(key: string, value: string): Promise<boolean> {
    return Promise.reject<boolean>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public length(key: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public dump(key: string): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public random(key: string): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pop(key: string): Promise<Nullable<string>> {
    return Promise.reject<Nullable<string>>(new UnimplementedError());
  }
}
