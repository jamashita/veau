import { Query } from './Query';

export interface Deal {

  with(query: Query): Promise<any>;
}
