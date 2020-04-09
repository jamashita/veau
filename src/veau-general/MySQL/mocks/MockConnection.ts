import { JSObjectNotation } from '../../Type/Value';
import { UnimplementedError } from '../../UnimplementedError';
import { IConnection } from '../interfaces/IConnection';

export class MockConnection implements IConnection {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute<R>(sql: string, value?: JSObjectNotation): Promise<R> {
    return Promise.reject<R>(new UnimplementedError());
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
