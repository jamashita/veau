import { IQuery } from './IQuery';

export interface IKernelQuery extends IQuery {
  readonly source: 'Kernel';
}
