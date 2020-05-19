import { IQuery } from '../../Interface/IQuery';

export interface IKernelQuery extends IQuery {
  readonly source: 'Kernel';
}
