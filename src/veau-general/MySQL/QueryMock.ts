import { IQuery } from './IQuery';

export class QueryMock implements IQuery {

  public execute(): Promise<void> {
    return Promise.resolve<void>(undefined);
  }
}
