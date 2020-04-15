import { UnimplementedError } from '../../UnimplementedError';
import { ISQL } from '../Interface/ISQL';

export class MockSQL implements ISQL {

  public execute<R>(): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }
}
