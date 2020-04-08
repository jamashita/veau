import { UnimplementedError } from '../../UnimplementedError';
import { IRedisList } from '../interfaces/IRedisList';

export class MockRedisList implements IRedisList{

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public push(key: string, value: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pop(key: string): Promise<string> {
    return Promise.reject<string>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public shift(key: string): Promise<string> {
    return Promise.reject<string>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public length(key: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public remove(key: string, value: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public select(key: string, offset: number, limit: number): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public dump(key: string): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }
}
