import { UnimplementedError } from '../../UnimplementedError';
import { IQuery } from '../interfaces/IQuery';

export class MockQuery implements IQuery {

  public execute<T>(): Promise<T> {
    return Promise.reject<T>(new UnimplementedError());
  }
}
