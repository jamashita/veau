import { IQuery } from '../interface/IQuery';

export interface IKernelQuery extends IQuery<string, 'Kernel'> {
  readonly source: 'Kernel';
}
