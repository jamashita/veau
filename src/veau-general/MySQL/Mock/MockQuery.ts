import { UnimplementedError } from '../../UnimplementedError';
import { IQuery } from '../Interface/IQuery';

export class MockQuery implements IQuery {

  public execute<R>(): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }
}
