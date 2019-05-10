import { Query } from './Query';

export interface Transaction {

  with(query: Query): Promise<any>;
}
