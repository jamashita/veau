import { IQuery } from './IQuery';
import { ITransaction } from './ITransaction';

export interface IMySQL extends IQuery {

  transact(transaction: ITransaction): Promise<void>;
}
