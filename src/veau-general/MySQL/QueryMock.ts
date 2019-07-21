import { IQuery } from './IQuery';

export class QueryMock implements IQuery {

  public execute(sql: string, value?: object): Promise<any> {
    return Promise.resolve<void>(undefined);
  }
}