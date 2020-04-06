import { UnimplementedError } from '../../UnimplementedError';
import { IConnection } from '../interfaces/IConnection';

export class MockConnection implements IConnection {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute<T>(sql: string, value?: object): Promise<T> {
    return Promise.reject<T>(new UnimplementedError());
  }

  public commit(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }

  public rollback(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }

  public release(): void {
    new UnimplementedError();
  }
}
