import { JSObjectNotation } from '../../Type/Value';
import { UnimplementedError } from '../../UnimplementedError';
import { IMySQL } from '../Interface/IMySQL';
import { ITransaction } from '../Interface/ITransaction';

export class MockMySQL implements IMySQL {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transact<R>(transaction: ITransaction<R>): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute<R>(sql: string, value?: JSObjectNotation): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
  }
}
