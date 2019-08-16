import { IQuery } from './IQuery';

export class QueryMock implements IQuery {

  public execute(): Promise<any> {
    return Promise.resolve<void>(undefined);
  }
}
