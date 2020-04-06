import { UnimplementedError } from '../../UnimplementedError';
import { IMySQL } from '../interfaces/IMySQL';
import { ITransaction } from '../interfaces/ITransaction';

export class MockMySQL implements IMySQL {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async transact(transaction: ITransaction): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute<T>(sql: string, value?: object): Promise<T> {
    return Promise.reject<T>(new UnimplementedError());
  }
}
