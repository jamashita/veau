import { IQuery } from './IQuery';

export interface IHeapQuery extends IQuery {
  readonly source: 'Heap';
}
