import { ICommand } from '../../Interface/ICommand';

export interface IKernelCommand extends ICommand<string, 'Kernel'> {
  readonly source: 'Kernel';
}
