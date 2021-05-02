import { IQuery } from '../../Interface/IQuery';

export interface IKernelQuery extends IQuery<string, 'Kernel'> {
  readonly source: 'Kernel';
}
