import { IQuery } from './IQuery';
import { ITransaction } from './ITransaction';

export interface IMySQL extends IQuery {

  transact<R>(transaction: ITransaction<R>): Promise<R>;
}
