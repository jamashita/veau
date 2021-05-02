import { IQuery } from '../interface/IQuery';

export interface IHeapQuery extends IQuery {
  readonly source: 'Heap';
}
