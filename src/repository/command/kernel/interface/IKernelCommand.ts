import { ICommand } from '../../interface/ICommand';

export interface IKernelCommand extends ICommand<string, 'Kernel'> {
  readonly source: 'Kernel';
}
