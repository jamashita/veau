import { UnimplementedError } from '../../UnimplementedError';
import { IRedisList } from '../interfaces/IRedisList';

export class MockRedisList implements IRedisList{

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async push(key: string, value: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async pop(key: string): Promise<string> {
    return Promise.reject<string>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async shift(key: string): Promise<string> {
    return Promise.reject<string>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async length(key: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async remove(key: string, value: string): Promise<number> {
    return Promise.reject<number>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async select(key: string, offset: number, limit: number): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async dump(key: string): Promise<Array<string>> {
    return Promise.reject<Array<string>>(new UnimplementedError());
  }
}
