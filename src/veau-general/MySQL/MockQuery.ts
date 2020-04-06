import { IQuery } from './IQuery';

export class MockQuery implements IQuery {

  public execute<T>(): Promise<T> {
    return Promise.resolve<T>(null as unknown as T);
  }
}
