import { IQuery } from './IQuery';

export interface ITransaction {

  with(query: IQuery): Promise<any>;
}
