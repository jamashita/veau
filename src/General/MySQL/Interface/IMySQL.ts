import { ISQL } from './ISQL';
import { ITransaction } from './ITransaction';

export interface IMySQL extends ISQL {

  transact<R>(transaction: ITransaction<R>): Promise<R>;
}
