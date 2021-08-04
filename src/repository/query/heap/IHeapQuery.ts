import { IQuery } from '../IQuery.js';

export interface IHeapQuery extends IQuery {
  readonly source: 'Heap';
}
