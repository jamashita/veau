import { IQuery } from '../../Interface/IQuery';

export interface IHeapQuery extends IQuery {
  readonly source: 'Heap';
}
